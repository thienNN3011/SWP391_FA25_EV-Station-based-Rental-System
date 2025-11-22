package vn.swp391.fa2025.evrental.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.request.MonthlyBookingStatsRequest;
import vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest;
import vn.swp391.fa2025.evrental.dto.request.StationCompletedBookingsRequest;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.*;
import vn.swp391.fa2025.evrental.enums.*;
import vn.swp391.fa2025.evrental.mapper.BookingMapper;
import vn.swp391.fa2025.evrental.repository.*;
import vn.swp391.fa2025.evrental.util.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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
                bookingRequest.getColor().toLowerCase()
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
        } else if (user.getRole()== UserRole.RENTER && booking.getUser().getUserId()!=user.getUserId()){
            throw new RuntimeException("Bạn không có quyền xem booking này");
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
    • Dự kiến kết thúc thuê xe: <b>%s</b><br>
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
        if (transactionDate.isBefore(LocalDateTime.now().minusMinutes(10))) throw new RuntimeException("Thời gian giao dịch không được quá 10p so với thời điểm hiện tại");
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
    public Payment cancelBooking(Long bookingId, String bankName, String bankAccount) {
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
        }
        booking.setActualEndTime(LocalDateTime.now());
        if (!BankUtils.isValidBankAccount(bankAccount)) {throw new RuntimeException("Tài khoản ngân hàng không được chứa kí tự khác số");}
        booking.setBankAccount(bankAccount);
        booking.setBankName(bankName);
        emailUtils.sendBookingCancelledEmail(booking, refund != null ? BigDecimalUtils.roundUpToIntegerWithTwoDecimals(refund.getAmount()) : null);
        Tariff tariff = booking.getTariff();
        tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()-1);
        tariffRepository.save(tariff);
        vehicleRepository.save(vehicle);
        booking.setStatus(BookingStatus.fromString("CANCELLED"));
        bookingRepository.save(booking);
        return refund;
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
        booking.setActualEndTime(LocalDateTime.now());
        tariffRepository.save(tariff);
        vehicleRepository.save(vehicle);
        booking.setStatus(BookingStatus.fromString("CANCELLED"));
        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public StopRentingTimeResponse endTimeRenting(Long bookingId) {
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
        bookingRepository.save(booking);
        StopRentingTimeResponse response= StopRentingTimeResponse.builder()
                .endTime(booking.getEndTime())
                .actualEndTime(booking.getActualEndTime())
                .extraFee(extraFee)
                .totalAmount(booking.getTotalAmount().add(extraFee))
                .build();
        return response;
    }

    @Override
    public BigDecimal getMyTotalRevenue() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        BigDecimal total = bookingRepository.getTotalRevenueByUsername(username);
        return total == null ? BigDecimal.ZERO : total;
    }

    @Override
    public List<BookingRefundResponse> listCancelledBookingRefund() {
        List<Object[]> results = bookingRepository.findCancelledWithRefundDetails();

        return results.stream().map(result -> {
            BookingRefundResponse response = new BookingRefundResponse();

            response.setBookingId(((Number) result[0]).longValue());
            response.setStatus((String) result[1]);
            if (result[2] instanceof java.sql.Timestamp) {
                response.setActualEndTime(((java.sql.Timestamp) result[2]).toLocalDateTime());
            } else {
                response.setActualEndTime((LocalDateTime) result[2]);
            }

            if (result[3] instanceof java.sql.Timestamp) {
                response.setStartTime(((java.sql.Timestamp) result[3]).toLocalDateTime());
            } else {
                response.setStartTime((LocalDateTime) result[3]);
            }

            response.setCustomerName((String) result[4]);
            response.setCustomerPhone((String) result[5]);
            response.setCustomerEmail((String) result[6]);
            response.setBankAccount((String) result[7]);
            response.setBankName((String) result[8]);
            response.setOriginalDeposit(new BigDecimal(result[9].toString()));
            response.setRefundRate(((Number) result[10]).intValue());
            response.setRefundAmount(
                    new BigDecimal(result[11].toString())
                            .setScale(0, RoundingMode.HALF_UP).setScale(2)
            );

            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public boolean isRefundWhenCancel(Long bookingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String rentername = authentication.getName();
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (!booking.getUser().getUsername().equalsIgnoreCase(rentername)) throw new RuntimeException("Không có quyền thao tác trên booking này");
        if (!booking.getStatus().toString().equalsIgnoreCase("BOOKING")) throw new RuntimeException("Chỉ có thể hủy booking ở trạng thái BOOKING");
        int minute = Integer.parseInt(systemConfigService.getSystemConfigByKey("CANCEL_BOOKING_REFUND_EXPIRE").getValue());
        if (booking.getStartTime().isAfter(LocalDateTime.now().plusMinutes(minute))) return true;
        return false;
    }

    @Transactional
    @Override
    public void updateBookingVehicle(Long bookingId, Long vehicleId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffname = authentication.getName();
        User staff= userRepository.findByUsername(staffname);
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (booking.getVehicle().getStation().getStationId()!=staff.getStation().getStationId()) throw new RuntimeException("Booking này không thuộc trạm của bạn!Booking thuộc trạm"+ booking.getVehicle().getStation().getStationName());
        if (booking.getStatus()!= BookingStatus.BOOKING) throw new RuntimeException("Booking không ở trạng thái BOOKING");
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Xe không tồn tại"));
        if (vehicle.getStatus()!=VehicleStatus.AVAILABLE) throw new RuntimeException("Xe được cập nhật không ở trạng thái có thể thuê");
        Vehicle currVehicle= booking.getVehicle();
        if (vehicle.getStation().getStationId()!=currVehicle.getStation().getStationId()) throw new RuntimeException("Xem được cập nhật không cùng trạm với xe hiện tại");
        if (vehicle.getModel().getModelId()!=currVehicle.getModel().getModelId()) throw new RuntimeException("Xe mới không cùng mẫu xe với xe hiện tại");
        currVehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(currVehicle);
        booking.setVehicle(vehicle);
        vehicle.setStatus(VehicleStatus.IN_USE);
        vehicleRepository.save(vehicle);
        emailUtils.sendVehicleChangedEmail(booking, currVehicle, vehicle);
    }

    @Override
    @Transactional
    public void cancelBookingForStaff(Long bookingId, String referenceCode, LocalDateTime transactionDate, String reason) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffname = authentication.getName();
        User staff= userRepository.findByUsername(staffname);
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (booking.getVehicle().getStation().getStationId()!=staff.getStation().getStationId()) throw new RuntimeException("Booking này không thuộc trạm của bạn!Booking thuộc trạm"+ booking.getVehicle().getStation().getStationName());
        if (booking.getStatus()!=BookingStatus.BOOKING) throw new RuntimeException("Booking chỉ có thể hủy ở trạng thái BOOKING");
        if (paymentRepository.findByReferenceCode(referenceCode)!=null) throw new RuntimeException("Mã thanh toán đã tồn tại");
        if (transactionDate.isBefore(LocalDateTime.now().minusMinutes(10))) throw new RuntimeException("Thời gian giao dịch không được quá 10p so với thời điểm hiện tại");
        paymentRepository.save(Payment.builder()
                .transactionDate(transactionDate)
                .booking(booking)
                .paymentType(PaymentType.fromString("REFUND_DEPOSIT"))
                .amount(paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), PaymentType.fromString("DEPOSIT")).getAmount())
                .referenceCode(referenceCode)
                .method(PaymentMethod.fromString("VIETCOMBANK"))
                .build());
        booking.setActualEndTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.CANCELLED);
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        bookingRepository.save(booking);
        vehicleRepository.save(vehicle);
        emailUtils.sendBookingCancelledByStaffEmail(
                booking,
                staff,
                reason
        );
    }

    @Override
    @Transactional(readOnly = true)
    public MonthlyBookingStatsResponse getMonthlyCompletedBookingsStats(MonthlyBookingStatsRequest request) {
        // Calculate start and end date for the month
        LocalDateTime startDate = LocalDateTime.of(request.getYear(), request.getMonth(), 1, 0, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1);

        MonthlyBookingStatsResponse.MonthlyBookingStatsResponseBuilder responseBuilder =
                MonthlyBookingStatsResponse.builder()
                        .month(request.getMonth())
                        .year(request.getYear());

        // If stationId is provided, get stats for that station only
        if (request.getStationId() != null) {
            Station station = stationRepository.findById(request.getStationId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trạm với ID: " + request.getStationId()));

            Long count = bookingRepository.countCompletedBookingsByMonthAndStation(
                    startDate, endDate, request.getStationId());

            return responseBuilder
                    .totalCompletedBookings(count)
                    .stationName(station.getStationName())
                    .stationBreakdown(null)
                    .build();
        }
        // Otherwise, get stats for all stations with breakdown
        else {
            Long totalCount = bookingRepository.countCompletedBookingsByMonth(startDate, endDate);
            List<StationBookingStatsDTO> breakdown =
                    bookingRepository.getCompletedBookingsBreakdownByStation(startDate, endDate);

            return responseBuilder
                    .totalCompletedBookings(totalCount)
                    .stationName(null)
                    .stationBreakdown(breakdown)
                    .build();
        }
    }

    /**
     * Lấy thống kê số lượng booking đã hoàn thành theo từng tháng trong năm của một trạm
     *
     * @param stationName Tên trạm cần thống kê
     * @param year Năm cần thống kê (VD: 2025)
     * @return Danh sách thống kê theo từng tháng, mỗi tháng chứa số lượng booking đã hoàn thành
     * @throws RuntimeException nếu trạm không tồn tại
     */
    @Override
    public List<StationCompletedBookingsResponse> getYearlyCompletedBookingsByStation(String stationName, int year) {
        // Bước 1: Kiểm tra trạm có tồn tại trong database không
        Station station = stationRepository.findByStationName(stationName);
        if (station == null) {
            throw new RuntimeException("Station không tồn tại");
        }

        // Khởi tạo danh sách kết quả để chứa thống kê của từng tháng
        List<StationCompletedBookingsResponse> result = new ArrayList<>();

        // Bước 2: Xác định số tháng cần thống kê
        // - Nếu là năm hiện tại: chỉ lấy từ tháng 1 đến tháng hiện tại (không lấy tháng tương lai)
        // - Nếu là năm trước: lấy đủ 12 tháng
        // VD: Năm 2025, tháng hiện tại là 11 → currentMonth = 11
        //     Năm 2024 → currentMonth = 12
        int currentMonth = (year == LocalDate.now().getYear())
                ? LocalDate.now().getMonthValue()
                : 12;

        // Bước 3: Lặp qua từng tháng để đếm số booking đã hoàn thành
        for (int month = 1; month <= currentMonth; month++) {
            // Tính ngày bắt đầu của tháng (ngày 1, giờ 00:00:00)
            // VD: Tháng 3/2025 → startDate = 2025-03-01 00:00:00
            LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0, 0);

            // Tính ngày kết thúc của tháng (= ngày đầu tháng tiếp theo)
            // VD: Tháng 3/2025 → endDate = 2025-04-01 00:00:00
            // Query sẽ lấy booking có actualEndTime >= startDate AND < endDate
            LocalDateTime endDate = startDate.plusMonths(1);

            // Gọi repository để đếm số booking COMPLETED trong khoảng thời gian này
            // Điều kiện: status = 'COMPLETED' AND actualEndTime trong [startDate, endDate) AND xe thuộc trạm này
            Long count = bookingRepository.countCompletedBookingsByMonthAndStation(
                    startDate, endDate, station.getStationId());

            // Tạo response object cho tháng này và thêm vào danh sách kết quả
            result.add(new StationCompletedBookingsResponse(
                    station.getStationId(),      // ID của trạm
                    station.getStationName(),    // Tên trạm
                    month,                       // Tháng (1-12)
                    year,                        // Năm
                    count                        // Số lượng booking đã hoàn thành
            ));
        }

        // Trả về danh sách thống kê (12 tháng hoặc ít hơn nếu là năm hiện tại)
        return result;
    }

}
