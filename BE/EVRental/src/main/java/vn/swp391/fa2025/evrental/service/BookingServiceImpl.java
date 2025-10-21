package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest;
import vn.swp391.fa2025.evrental.dto.response.BookingResponse;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.entity.*;
import vn.swp391.fa2025.evrental.mapper.BookingMapper;
import vn.swp391.fa2025.evrental.repository.*;
import vn.swp391.fa2025.evrental.util.EmailUtils;
import vn.swp391.fa2025.evrental.util.TimeUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class BookingServiceImpl implements  BookingService{
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private TariffRepository tariffRepository;
    @Autowired
    private StationRepository stationRepository;
    @Autowired
    private ContractGeneratorService contractGeneratorService;
    @Autowired
    private BookingMapper bookingMapper;
    @Autowired
    private ContractServiceImpl contractService;
    @Autowired
    private EmailUtils emailUtils;

    @Override
    public BookingResponse bookVehicle(BookingRequest bookingRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        Booking booking = new Booking();
        booking.setUser(userRepository.findByUsername(username));
        Station station= stationRepository.findByStationName(bookingRequest.getStationName());
        if (station==null || !station.getStatus().equals("OPEN")) throw new RuntimeException("Trạm không tồn tại hoặc hiện tại không khả dụng");
        List<Vehicle> vehicles = vehicleRepository.findByStation_StationIdAndModel_ModelIdAndColor(station.getStationId(),bookingRequest.getModelId(), bookingRequest.getColor());
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getStatus().equals("AVAILABLE")) {
                vehicle.setStatus("BOOKED");
                booking.setVehicle(vehicle);
                break;
            }
        }
        if (booking.getVehicle()==null) {
            throw new RuntimeException("Hiện tại không có xe nào khả dụng cho mẫu xe này");
        }
        if (bookingRequest.getStartTime().isBefore(LocalDateTime.now())) throw new RuntimeException("Thời gian bắt đầu phải sau thời gian hiện tại");
        booking.setStartTime(bookingRequest.getStartTime());
        if (bookingRequest.getEndTime().isBefore(booking.getStartTime())) throw new RuntimeException("Thời gian kết thúc phải sau thời gian bắt đầu");
        booking.setEndTime(bookingRequest.getEndTime());
        Tariff tariff=tariffRepository.findById(bookingRequest.getTariffId()).orElseThrow(()-> new RuntimeException("Tariff không tồn tại"));
        if (tariffRepository.findByTariffIdAndModel_ModelId(bookingRequest.getTariffId(), bookingRequest.getModelId())==null) throw new RuntimeException("Tariff không phù hợp với Model hiện tại");
        if (tariff.getStatus().equals("INACTIVE")) throw new RuntimeException("Tariff hiện tại không khả dụng");
        booking.setTariff(tariff);
        booking.setCreatedDate(LocalDateTime.now());
        booking.setStatus("BOOKING");
        booking.setTotalAmount((Double) 0.0);
        if (bookingRepository.save(booking)!=null) {
            Vehicle vehicle= booking.getVehicle();
            vehicle.setStatus("BOOKED");
            vehicleRepository.save(vehicle);
            tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()+1);
            tariffRepository.save(tariff);
        }
        VehicleResponse vehicleResponse= new VehicleResponse(
                booking.getVehicle().getPlateNumber(),
                booking.getVehicle().getColor(),
                booking.getVehicle().getModel().getName(),
                booking.getVehicle().getModel().getBrand()
        );
        StationResponse stationResponse= new StationResponse(
                station.getStationName(),
                station.getAddress(),
                station.getOpeningHours()
        );

        TariffResponse tariffResponse= new TariffResponse(
                tariff.getTariffId(),
                tariff.getType(),
                tariff.getPrice(),
                tariff.getDepositAmount()
        );

        BookingResponse bookingResponse= BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .username(username)
                .vehicle(vehicleResponse)
                .station(stationResponse)
                .tariff(tariffResponse)
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .build();
        return bookingResponse;
    }

    @Override
    public List<BookingResponse> getBookingByStatus(ShowBookingRequest request) {
        List<BookingResponse> bookings= new ArrayList<>();
        if (request.getStatus()==null) request.setStatus("ALL");
        String[] statuss={"BOOKING","RENTING","COMPLETED","CANCELLED", "ALL"};
        boolean checkStatus= false;
        for (String status : statuss) {
            if (status.equalsIgnoreCase(request.getStatus())) {
                checkStatus= true;
                break;
            }
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!checkStatus) throw new RuntimeException("Trạng thái không hợp lệ");
        String username = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        List<Booking> bookingList= new ArrayList<>();
        if (role.equalsIgnoreCase("STAFF")) {
            User user = userRepository.findByUsername(username);
            Long stationId = user.getStation().getStationId();
            if (!request.getStatus().equalsIgnoreCase("ALL")) bookingList=bookingRepository.findByStatusAndVehicle_Station_StationId(request.getStatus(), stationId); else
                bookingList=bookingRepository.findByVehicle_Station_StationId(stationId);
        } else if (role.equalsIgnoreCase("RENTER")) {
            if (!request.getStatus().equalsIgnoreCase("ALL")) bookingList= bookingRepository.findByStatusAndUser_Username(request.getStatus(), username); else
                bookingList= bookingRepository.findByUser_Username(username);
        } else if (role.equalsIgnoreCase("ADMIN")){
            if (!request.getStatus().equalsIgnoreCase("ALL")) bookingList= bookingRepository.findByStatus(request.getStatus()); else
                bookingList= bookingRepository.findAll();
        }
        Comparator<Booking> comparator;
        switch (request.getStatus()) {
            case "BOOKING" -> comparator = Comparator.comparing(Booking::getStartTime);
            case "RENTING" -> comparator = Comparator.comparing(Booking::getActualStartTime);
            case "COMPLETED" -> comparator = Comparator.comparing(Booking::getActualEndTime).reversed();
            case "CANCELLED" -> comparator = Comparator.comparing(Booking::getCreatedDate).reversed();
            default -> comparator = Comparator.comparing(Booking::getCreatedDate).reversed();
        }
        bookingList.sort(comparator);
        return bookingMapper.toBookingResponse(bookingList);
    }

    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking= bookingRepository.findById(id).orElseThrow(()-> new RuntimeException("Booking không tồn tại"));
        return bookingMapper.toBookingResponse(booking);
    }

    @Override
    @Transactional
    public String startRental(Long bookingId, String vehicleStatus, Long startOdo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffname = authentication.getName();
        User staff=userRepository.findByUsername(staffname);
        if (staff==null || !staff.getRole().equalsIgnoreCase("STAFF")) throw new RuntimeException("User không hợp lệ");
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (!booking.getStatus().equalsIgnoreCase("BOOKING")) throw new RuntimeException("Booking không ở trạng thái BOOKING");
        User customer = userRepository
                .findById(booking.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("Customer không tồn tại"));
        Vehicle vehicle = vehicleRepository
                .findById(booking.getVehicle().getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle không tồn tại"));
        Map<String, String> data = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        data.put("contractDate", java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        data.put("staffName", staff.getFullName());
        data.put("staffId", String.valueOf(staff.getUserId()));
        data.put("staffEmail", staff.getEmail());
        data.put("customerName", customer.getFullName());
        data.put("customerIdCard", customer.getIdCard());
        data.put("customerDriveLicense", customer.getDriveLicense());
        data.put("customerPhone", customer.getPhone());
        data.put("customerEmail", customer.getEmail());
        data.put("vehiclePlate", vehicle.getPlateNumber());
        data.put("vehicleModel", vehicle.getModel().getName());
        data.put("vehicleColor", vehicle.getColor());
        data.put("vehicleStatus", vehicleStatus);
        data.put("bookingId", String.valueOf(booking.getBookingId()));
        booking.setActualStartTime(LocalDateTime.now());
        data.put("startTime", booking.getActualStartTime().format(formatter));
        data.put("endTime", booking.getEndTime().format(formatter));
        data.put("tariffPrice", booking.getTariff().getPrice() + " VND");
        data.put("tariffType", booking.getTariff().getType());
        data.put("depositAmount", booking.getTariff().getDepositAmount() + " VND");
        Double totalAmount= TimeUtils.ceilTimeDiff(booking.getEndTime(), booking.getActualStartTime(), booking.getTariff().getType()) * booking.getTariff().getPrice();
        booking.setTotalAmount(totalAmount);
        data.put("totalAmount", booking.getTotalAmount() + " VND");
        byte[] pdfBytes=null;
        try {
            pdfBytes = contractGeneratorService.generatePdfContract(data);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        booking.setStartOdo(startOdo);
        bookingRepository.save(booking);
        String token = UUID.randomUUID().toString();
        contractService.saveContractFile(pdfBytes, booking, customer, staff, token);
        String confirmUrl = "http://localhost:8080/EVRental/bookings/confirm?token=" + token;
        String rejectUrl = "http://localhost:8080/EVRental/bookings/reject?token=" + token;

        String emailBody = """
        <p>Xin chào %s,</p>
        <p>Vui lòng xem xét hợp đồng thuê xe đính kèm.</p>
        <p>Nhấn vào nút bên dưới để xác nhận hoặc từ chối hợp đồng:</p>
        <p>
            <a href="%s" style="background:green;color:white;padding:10px 15px;text-decoration:none;">Đồng ý</a>
            &nbsp;&nbsp;
            <a href="%s" style="background:red;color:white;padding:10px 15px;text-decoration:none;">Từ chối</a>
        </p>
        <p>Trân trọng,<br>Đội ngũ EVRental</p>
    """.formatted(customer.getFullName(), confirmUrl, rejectUrl);

        emailUtils.sendEmailWithAttachment(
                customer.getEmail(),
                "Xác nhận hợp đồng thuê xe #" + booking.getBookingId(),
                emailBody,
                pdfBytes,
                "contract.pdf"
        );
        return "Bạn đã bắt đầu thuê xe thành công. Hợp đồng đã được gửi đến email của khách hàng để xác nhận.";
    }
}
