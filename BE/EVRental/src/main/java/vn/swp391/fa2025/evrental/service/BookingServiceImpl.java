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
import vn.swp391.fa2025.evrental.enums.BookingStatus;
import vn.swp391.fa2025.evrental.enums.PaymentMethod;
import vn.swp391.fa2025.evrental.enums.PaymentType;
import vn.swp391.fa2025.evrental.enums.VehicleStatus;
import vn.swp391.fa2025.evrental.mapper.BookingMapper;
import vn.swp391.fa2025.evrental.repository.*;
import vn.swp391.fa2025.evrental.util.EmailUtils;
import vn.swp391.fa2025.evrental.util.QrUtils;
import vn.swp391.fa2025.evrental.util.TimeUtils;

import java.math.BigDecimal;
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
    @Autowired
    private SystemConfigServiceImpl systemConfigService;

    @Override
    @Transactional
    public AfterBookingResponse bookVehicle(HttpServletRequest req, BookingRequest bookingRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        Booking booking = new Booking();
        booking.setUser(userRepository.findByUsername(username));
        Station station= stationRepository.findByStationName(bookingRequest.getStationName());
        if (station==null || !station.getStatus().toString().equals("OPEN")) throw new RuntimeException("Trạm không tồn tại hoặc hiện tại không khả dụng");
        Vehicle vehicle = vehicleRepository.findOneAvailableVehicleForUpdate(
                station.getStationId(),
                bookingRequest.getModelId(),
                bookingRequest.getColor()
        ).orElseThrow(() -> new RuntimeException("Hiện không có xe nào khả dụng cho mẫu xe này"));
        booking.setVehicle(vehicle);
        LocalDateTime now= LocalDateTime.now();
        LocalDate roundedCurrentDate = now.toLocalDate();
        if (!now.toLocalTime().equals(LocalTime.MIDNIGHT)) {
            roundedCurrentDate = roundedCurrentDate.plusDays(1);
        }
        LocalDateTime startTime=bookingRequest.getStartTime();
        LocalDate roundedStartDate = startTime.toLocalDate();
        if (!startTime.toLocalTime().equals(LocalTime.MIDNIGHT)) {
            roundedStartDate = roundedStartDate.plusDays(1);
        }
        if (bookingRequest.getStartTime().isBefore(LocalDateTime.now())) throw new RuntimeException("Thời gian bắt đầu phải sau thời gian hiện tại");
        if (roundedStartDate.isAfter(roundedCurrentDate.plusWeeks(1))) {
            throw new RuntimeException("Ngày bắt đầu không được vượt quá 1 tuần kể từ hôm nay.");
        }
        booking.setStartTime(bookingRequest.getStartTime());
        if (bookingRequest.getEndTime().isBefore(booking.getStartTime())) throw new RuntimeException("Thời gian kết thúc phải sau thời gian bắt đầu");
        booking.setEndTime(bookingRequest.getEndTime());
        Tariff tariff=tariffRepository.findById(bookingRequest.getTariffId()).orElseThrow(()-> new RuntimeException("Tariff không tồn tại"));
        if (tariffRepository.findByTariffIdAndModel_ModelId(bookingRequest.getTariffId(), bookingRequest.getModelId())==null) throw new RuntimeException("Gói thuê không phù hợp với Model xe hiện tại");
        if (tariff.getStatus().toString().equals("INACTIVE")) throw new RuntimeException("Gói thuê hiện tại không khả dụng");
        booking.setTariff(tariff);
        booking.setCreatedDate(LocalDateTime.now());
        booking.setStatus(BookingStatus.fromString("UNCONFIRMED"));
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
        User renter=booking.getUser();
        CustomerResponse customerResponse= CustomerResponse.builder()
                .fullName(renter.getFullName())
                .phone(renter.getPhone())
                .idCardPhoto(renter.getIdCardPhoto())
                .driveLicensePhoto(renter.getDriveLicensePhoto())
                .build();

        if (bookingRepository.save(booking)!=null) {
            vehicle.setStatus(VehicleStatus.fromString("IN_USE"));
            vehicleRepository.save(vehicle);
            tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()+1);
            tariffRepository.save(tariff);
        }

        BookingResponse bookingResponse= BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .user(customerResponse)
                .vehicle(vehicleResponse)
                .station(stationResponse)
                .tariff(tariffResponse)
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus().toString())
                .build();
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
            if (!request.getStatus().equalsIgnoreCase("ALL")) bookingList=bookingRepository.findByStatusAndVehicle_Station_StationId(BookingStatus.fromString(request.getStatus()), stationId); else
                bookingList=bookingRepository.findByVehicle_Station_StationId(stationId);
        } else if (role.equalsIgnoreCase("RENTER")) {
            if (!request.getStatus().equalsIgnoreCase("ALL")) bookingList= bookingRepository.findByStatusAndUser_Username(BookingStatus.fromString(request.getStatus()), username); else
                bookingList= bookingRepository.findByUser_Username(username);
        } else if (role.equalsIgnoreCase("ADMIN")){
            if (!request.getStatus().equalsIgnoreCase("ALL")) bookingList= bookingRepository.findByStatus(BookingStatus.fromString(request.getStatus())); else
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
        if (user.getRole().toString().equalsIgnoreCase("STAFF") && !user.getStation().getStationId().equals(booking.getVehicle().getStation().getStationId())) {
            throw new RuntimeException("Booking này không thuộc trạm của bạn!Booking thuộc trạm"+ booking.getVehicle().getStation().getStationName());
        }
        return bookingMapper.toBookingResponse(booking);
    }

    @Override
    @Transactional
    public String startRental(Long bookingId, String vehicleStatus, Long startOdo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffname = authentication.getName();
        User staff=userRepository.findByUsername(staffname);
        if (startOdo<0) throw new RuntimeException("Số km bắt đầu phải lớn hơn hoặc bằng 0");
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (booking.getVehicle().getStation().getStationId()!=staff.getStation().getStationId()) throw new RuntimeException("Booking này không thuộc trạm của bạn!Booking thuộc trạm"+ booking.getVehicle().getStation().getStationName());
        if (!booking.getStatus().toString().equalsIgnoreCase("BOOKING")) throw new RuntimeException("Booking không ở trạng thái BOOKING");
        User customer = userRepository
                .findById(booking.getUser().getUserId())
                .orElseThrow(() -> new RuntimeException("Khách thuê không tồn tại"));
        Vehicle vehicle = vehicleRepository
                .findById(booking.getVehicle().getVehicleId())
                .orElseThrow(() -> new RuntimeException("Xe không tồn tại"));
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
        int pen= Integer.parseInt(systemConfigService.getSystemConfigByKey("OVERTIME_EXTRA_RATE").getValue());
        data.put("penalty", String.valueOf(pen));
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

        String confirmUrl = "http://localhost:8080/EVRental/bookings/confirm?token=" + token;
        String rejectUrl = "http://localhost:8080/EVRental/bookings/reject?token=" + token;



        String subject = "Xác nhận hợp đồng thuê xe #" + booking.getBookingId();

        String message = String.format("""
    Xin chào <b>%s</b>,<br>
    Hệ thống EV Rental đã tạo hợp đồng thuê xe của bạn. Vui lòng xem tệp hợp đồng đính kèm để kiểm tra thông tin.<br><br>
    <b>Thông tin chi tiết:</b><br>
    • Xe: <b>%s - %s</b><br>
    • Màu sắc: <b>%s</b><br>
    • Bắt đầu: <b>%s</b><br>
    • Kết thúc: <b>%s</b><br>
    • Giá thuê: <b>%,.0f VND</b><br>
    • Đặt cọc: <b>%,.0f VND</b><br><br>
    Nhấn vào một trong các nút bên dưới để xác nhận hoặc từ chối hợp đồng:<br><br>
    <a href="%s" style="background-color: #2e7d32; color: white; padding: 10px 15px; border-radius: 6px; text-decoration: none;">✅ Đồng ý</a>
    &nbsp;&nbsp;
    <a href="%s" style="background-color: #d32f2f; color: white; padding: 10px 15px; border-radius: 6px; text-decoration: none;">❌ Từ chối</a><br><br>
    Sau khi xác nhận, quá trình thuê xe sẽ được bắt đầu.
""",
                customer.getFullName(),
                vehicle.getModel().getName(),
                vehicle.getPlateNumber(),
                vehicle.getColor(),
                booking.getActualStartTime().format(formatter),
                booking.getEndTime().format(formatter),
                booking.getTariff().getPrice(),
                booking.getTariff().getDepositAmount(),
                confirmUrl,
                rejectUrl
        );
        String body = emailUtils.buildBaseEmailTemplate(
                "Xác nhận hợp đồng thuê xe",
                message,
                null,
                "#1976d2"
        );

        emailUtils.sendEmailWithAttachment(
                customer.getEmail(),
                subject,
                body,
                pdfBytes,
                "contract.pdf"
        );

        return "Bạn đã bắt đầu thuê xe thành công. Hợp đồng đã được gửi đến email của khách hàng để xác nhận.";
    }

    @Override
    @Transactional
    public EndRentingResponse endRental(HttpServletRequest request, Long bookingId, String vehicleStatus,
                                        Long endOdo, LocalDateTime transactionDate, String referanceCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffname = authentication.getName();
        User staff=userRepository.findByUsername(staffname);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        if (booking.getVehicle().getStation().getStationId()!=staff.getStation().getStationId()) throw new RuntimeException("Booking này không thuộc trạm của bạn!Booking thuộc trạm"+ booking.getVehicle().getStation().getStationName());
        if (booking.getContract().getStaff().getUserId()!=staff.getUserId()) throw new RuntimeException("Bạn không phải nhân viên thụ lí booking này");
        if (!booking.getStatus().toString().equalsIgnoreCase("RENTING"))
            throw new RuntimeException("Booking không ở trạng thái RENTING");
        if (booking.getActualEndTime()==null) throw new RuntimeException("Bạn chưa kết thúc thời gian thuê xe");
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
            int extraRateInt = Integer.parseInt(systemConfigService.getSystemConfigByKey("OVERTIME_EXTRA_RATE").getValue());
            BigDecimal extraRate = BigDecimal.valueOf(extraRateInt).divide(BigDecimal.valueOf(100));

            extraFee = BigDecimal.valueOf(overtime)
                    .multiply(
                            booking.getTariff().getPrice()
                                    .add(booking.getTariff().getPrice().multiply(extraRate))
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
        if (paymentRepository.findByReferenceCode(referanceCode)!=null) throw new RuntimeException("Mã thanh toán đã tồn tại");
        if (transactionDate.isAfter(LocalDateTime.now().plusMinutes(10))) throw new RuntimeException("Thời gian giao dịch không được quá 10p so với thời điểm hiện tại");
        paymentRepository.save(Payment.builder()
                .transactionDate(transactionDate)
                .booking(booking)
                .paymentType(PaymentType.fromString("REFUND_DEPOSIT"))
                .amount(paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), PaymentType.fromString("DEPOSIT")).getAmount())
                .referenceCode(referanceCode)
                .method(PaymentMethod.fromString("VIETCOMBANK"))
                .build());

        EndRentingResponse response = EndRentingResponse.builder()
                .bookingResponse(bookingMapper.toEndBookingResponse(booking))
                .qr(qr)
                .build();
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(VehicleStatus.fromString("MAINTENANCE"));
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
    @Transactional
    public void updateBooking(Booking booking) {
        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Payment cancelBooking(Long bookingId) {
        Payment refund=null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String rentername = authentication.getName();
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (!booking.getUser().getUsername().equalsIgnoreCase(rentername)) throw new RuntimeException("Không có quyền thao tác trên booking này");
        if (!booking.getStatus().toString().equalsIgnoreCase("BOOKING")) throw new RuntimeException("Chỉ có thể hủy booking ở trạng thái BOOKING");
        Vehicle vehicle = vehicleRepository
                .findById(booking.getVehicle().getVehicleId())
                .orElseThrow(() -> new RuntimeException("Xe không tồn tại"));
        vehicle.setStatus(VehicleStatus.fromString("AVAILABLE"));
        int minute = Integer.parseInt(systemConfigService.getSystemConfigByKey("CANCEL_BOOKING_REFUND_EXPIRE").getValue());
        if (booking.getStartTime().isAfter(LocalDateTime.now().plusMinutes(minute))) {
            Payment deposit = paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), PaymentType.fromString("DEPOSIT"));
            int extraRateInt = Integer.parseInt(systemConfigService.getSystemConfigByKey("REFUND").getValue());
            BigDecimal extraRate = BigDecimal.valueOf(extraRateInt).divide(BigDecimal.valueOf(100));
            refund = Payment.builder()
                    .booking(booking)
                    .transactionDate(LocalDateTime.now())
                    .paymentType(PaymentType.fromString("REFUND_DEPOSIT"))
                    .amount(deposit.getAmount().multiply(extraRate))
                    .referenceCode("REFUND_" + System.currentTimeMillis())
                    .method(PaymentMethod.fromString("VN_PAY"))
                    .build();
            paymentRepository.save(refund);
        }
        emailUtils.sendBookingCancelledEmail(booking, refund != null ? refund.getAmount() : null);
        Tariff tariff = booking.getTariff();
        tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()-1);
        tariffRepository.save(tariff);
        vehicleRepository.save(vehicle);
        booking.setStatus(BookingStatus.fromString("CANCELLED"));
        bookingRepository.save(booking);
        return paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), PaymentType.fromString("REFUND_DEPOSIT"));
    }

    @Override
    @Transactional
    public void cancelBookingForSystem(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (!booking.getStatus().toString().equalsIgnoreCase("UNCONFIRMED") && !booking.getStatus().toString().equalsIgnoreCase("BOOKING")) throw new RuntimeException("Chỉ có thể hủy booking ở trạng thái BOOKING/UNCONFIRMED");
        Vehicle vehicle = vehicleRepository
                .findById(booking.getVehicle().getVehicleId())
                .orElseThrow(() -> new RuntimeException("Xe không tồn tại"));
        vehicle.setStatus(VehicleStatus.fromString("AVAILABLE"));
        Tariff tariff = booking.getTariff();
        tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()-1);
        tariffRepository.save(tariff);
        vehicleRepository.save(vehicle);
        booking.setStatus(BookingStatus.fromString("CANCELLED"));
        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void endTimeRenting(Long bookingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffname = authentication.getName();
        User staff=userRepository.findByUsername(staffname);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        if (booking.getVehicle().getStation().getStationId()!=staff.getStation().getStationId()) throw new RuntimeException("Booking này không thuộc trạm của bạn!Booking thuộc trạm"+ booking.getVehicle().getStation().getStationName());
        if (booking.getContract().getStaff().getUserId()!=staff.getUserId()) throw new RuntimeException("Bạn không phải nhân viên thụ lí booking này");
        if (!booking.getStatus().toString().equalsIgnoreCase("RENTING"))
            throw new RuntimeException("Booking không ở trạng thái RENTING");
        booking.setActualEndTime(LocalDateTime.now());
        bookingRepository.save(booking);
    }

    @Override
    public BigDecimal getMyTotalRevenue() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        BigDecimal total = bookingRepository.getTotalRevenueByUsername(username);
        return total == null ? BigDecimal.ZERO : total;
    }
}
