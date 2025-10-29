package vn.swp391.fa2025.evrental.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.*;
import vn.swp391.fa2025.evrental.mapper.BookingMapper;
import vn.swp391.fa2025.evrental.repository.*;
import vn.swp391.fa2025.evrental.util.EmailUtils;
import vn.swp391.fa2025.evrental.util.QrUtils;
import vn.swp391.fa2025.evrental.util.TimeUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    @Autowired
    private VnPayService vnPayService;
    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public AfterBookingResponse bookVehicle(HttpServletRequest req, BookingRequest bookingRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        Booking booking = new Booking();
        booking.setUser(userRepository.findByUsername(username));
        Station station= stationRepository.findByStationName(bookingRequest.getStationName());
        if (station==null || !station.getStatus().equals("OPEN")) throw new RuntimeException("Trạm không tồn tại hoặc hiện tại không khả dụng");
        List<Vehicle> vehicles = vehicleRepository.findByStation_StationIdAndModel_ModelIdAndColor(station.getStationId(),bookingRequest.getModelId(), bookingRequest.getColor());
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getStatus().equals("AVAILABLE")) {
                vehicle.setStatus("IN_USE");
                booking.setVehicle(vehicle);
                break;
            }
        }
        if (booking.getVehicle()==null) {
            throw new RuntimeException("Hiện tại không có xe nào khả dụng cho mẫu xe này");
        }
        LocalDateTime now= LocalDateTime.now();
        LocalDateTime startTime=bookingRequest.getStartTime();
        if (bookingRequest.getStartTime().isBefore(LocalDateTime.now())) throw new RuntimeException("Thời gian bắt đầu phải sau thời gian hiện tại");
        LocalDate currentDate = now.toLocalDate();
        LocalDate startDate = startTime.toLocalDate();
        if (!startTime.toLocalTime().equals(LocalTime.MIDNIGHT)) {
            startDate = startDate.plusDays(1);
        }
        if (startDate.isAfter(currentDate.plusWeeks(1))) {
            throw new RuntimeException("Ngày kết thúc không được vượt quá 1 tuần kể từ hôm nay.");
        }
        booking.setStartTime(bookingRequest.getStartTime());
        if (bookingRequest.getEndTime().isBefore(booking.getStartTime())) throw new RuntimeException("Thời gian kết thúc phải sau thời gian bắt đầu");
        booking.setEndTime(bookingRequest.getEndTime());
        Tariff tariff=tariffRepository.findById(bookingRequest.getTariffId()).orElseThrow(()-> new RuntimeException("Tariff không tồn tại"));
        if (tariffRepository.findByTariffIdAndModel_ModelId(bookingRequest.getTariffId(), bookingRequest.getModelId())==null) throw new RuntimeException("Tariff không phù hợp với Model hiện tại");
        if (tariff.getStatus().equals("INACTIVE")) throw new RuntimeException("Tariff hiện tại không khả dụng");
        booking.setTariff(tariff);
        booking.setCreatedDate(LocalDateTime.now());
        booking.setStatus("UNCONFIRMED");
        booking.setTotalAmount((BigDecimal) BigDecimal.ZERO);
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
        if (bookingRepository.save(booking)!=null) {
            Vehicle vehicle= booking.getVehicle();
            vehicle.setStatus("IN_USE");
            vehicleRepository.save(vehicle);
            tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()+1);
            tariffRepository.save(tariff);
        }
        bookingRepository.save(booking);
        String paymentUrl="";
        try {
            paymentUrl= vnPayService.createPaymentUrl(req, booking.getTariff().getDepositAmount(), "Thanh toán đặt cọc cho Booking ID: "+booking.getBookingId(), booking.getBookingId());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        String qr="";
        try {
            qr= QrUtils.generateQrBase64(paymentUrl);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        AfterBookingResponse response= AfterBookingResponse.builder()
                .bookingResponse(bookingResponse)
                .qr(qr)
                .build();
        return response;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username=authentication.getName();
        User user = userRepository.findByUsername(username);
        Booking booking= bookingRepository.findById(id).orElseThrow(()-> new RuntimeException("Booking không tồn tại"));
        if (user.getRole().equalsIgnoreCase("STAFF") && !user.getStation().getStationId().equals(booking.getVehicle().getStation().getStationId())) {
            throw new RuntimeException("Booking này không thuộc station của bạn!");
        }
        return bookingMapper.toBookingResponse(booking);
    }

    @Override
    @Transactional
    public String startRental(Long bookingId, String vehicleStatus, Long startOdo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffname = authentication.getName();
        User staff=userRepository.findByUsername(staffname);
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (booking.getVehicle().getStation().getStationId()!=staff.getStation().getStationId()) throw new RuntimeException("Bạn không có quyền tương tác với booking này");
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
        BigDecimal totalAmount = BigDecimal.valueOf(
                TimeUtils.ceilTimeDiff(
                        booking.getEndTime(),
                        booking.getActualStartTime(),
                        booking.getTariff().getType()
                )
        ).multiply(booking.getTariff().getPrice());
        booking.setTotalAmount(totalAmount);
        data.put("totalAmount", booking.getTotalAmount() + " VND");
        byte[] pdfBytes=null;
        try {
            pdfBytes = contractGeneratorService.generatePdfContract(data);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        booking.setBeforeRentingStatus(vehicleStatus);
        booking.setStartOdo(startOdo);
        bookingRepository.save(booking);
        String token = UUID.randomUUID().toString();
        contractService.saveContractFile(pdfBytes, booking, customer, staff, token);
        String frontendBaseUrl = "http://localhost:3000"; //test tren fe port ko dc thi xoa
       // String confirmUrl = "http://localhost:8080/EVRental/bookings/confirm?token=" + token;
       // String rejectUrl = "http://localhost:8080/EVRental/bookings/reject?token=" + token;
       //co loi thi xoa
        String confirmUrl = frontendBaseUrl + "/rental-response?action=confirm&token=" + token;
        String rejectUrl = frontendBaseUrl + "/rental-response?action=reject&token=" + token;

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

    @Override
    public EndRentingResponse endRental(HttpServletRequest request, Long bookingId, String vehicleStatus,
                                        Long endOdo, LocalDateTime transactionDate, String referanceCode) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        if (!booking.getStatus().equalsIgnoreCase("RENTING"))
            throw new RuntimeException("Booking không ở trạng thái RENTING");

        booking.setActualEndTime(LocalDateTime.now());

        if (booking.getStartOdo() > endOdo)
            throw new RuntimeException("Số km kết thúc phải lớn hơn số km bắt đầu");

        booking.setEndOdo(endOdo);
        booking.setAfterRentingStatus(vehicleStatus);

        Long overtime = 0L;
        if (booking.getActualEndTime().isAfter(booking.getEndTime())) {
            overtime = TimeUtils.ceilTimeDiff(
                    booking.getActualEndTime(),
                    booking.getEndTime(),
                    booking.getTariff().getType()
            );
        }

        BigDecimal extraFee = BigDecimal.ZERO;
        if (overtime > 0) {
            extraFee = BigDecimal.valueOf(overtime)
                    .multiply(
                            booking.getTariff().getPrice()
                                    .add(booking.getTariff().getPrice().multiply(BigDecimal.valueOf(0.1))) // +10%
                    );
            booking.setTotalAmount(booking.getTotalAmount().add(extraFee));
        }

        String paymentUrl;
        try {
            paymentUrl = vnPayService.createPaymentUrl(
                    request,
                    booking.getTotalAmount(),
                    "Thanh toán chi phí cho Booking ID: " + booking.getBookingId(),
                    booking.getBookingId()
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        String qr;
        try {
            qr = QrUtils.generateQrBase64(paymentUrl);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        paymentRepository.save(Payment.builder()
                .transactionDate(transactionDate)
                .booking(booking)
                .paymentType("REFUND_DEPOSIT")
                .amount(paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), "DEPOSIT").getAmount())
                .referenceCode(referanceCode)
                .build());

        EndRentingResponse response = EndRentingResponse.builder()
                .bookingResponse(bookingMapper.toEndBookingResponse(booking))
                .qr(qr)
                .build();
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus("MAINTENANCE");
        vehicleRepository.save(vehicle);
        Tariff tariff = booking.getTariff();
        tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling() - 1);
        tariffRepository.save(tariff);
        bookingRepository.save(booking);
        return response;
    }


    @Override
    public Booking findById(Long id) {
        return bookingRepository.findById(id).orElseThrow(()-> new RuntimeException("Booking không tồn tại"));
    }

    @Override
    public void updateBooking(Booking booking) {
        bookingRepository.save(booking);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String rentername = authentication.getName();
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (!booking.getUser().getUsername().equalsIgnoreCase(rentername)) throw new RuntimeException("Không có quyền thao tác trên booking này");
        if (!booking.getStatus().equalsIgnoreCase("UNCONFIRMED") && !booking.getStatus().equalsIgnoreCase("BOOKING")) throw new RuntimeException("Chỉ có thể hủy booking ở trạng thái BOOKING/UNCONFIRMED");
        Vehicle vehicle = vehicleRepository
                .findById(booking.getVehicle().getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle không tồn tại"));
        vehicle.setStatus("AVAILABLE");
        Payment deposit=paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), "DEPOSIT");
        Payment refund = Payment.builder()
                .booking(booking)
                .transactionDate(LocalDateTime.now())
                .paymentType("REFUND_DEPOSIT")
                .amount(deposit.getAmount().multiply(new BigDecimal("0.7")))
                .referenceCode("REFUND_" + System.currentTimeMillis())
                .build();
        paymentRepository.save(refund);
        Tariff tariff = booking.getTariff();
        tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()-1);
        tariffRepository.save(tariff);
        vehicleRepository.save(vehicle);
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    @Override
    public void cancelBookingForSystem(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (!booking.getStatus().equalsIgnoreCase("UNCONFIRMED") && !booking.getStatus().equalsIgnoreCase("BOOKING")) throw new RuntimeException("Chỉ có thể hủy booking ở trạng thái BOOKING/UNCONFIRMED");
        Vehicle vehicle = vehicleRepository
                .findById(booking.getVehicle().getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle không tồn tại"));
        vehicle.setStatus("AVAILABLE");
        Tariff tariff = booking.getTariff();
        tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()-1);
        tariffRepository.save(tariff);
        vehicleRepository.save(vehicle);
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }
}
