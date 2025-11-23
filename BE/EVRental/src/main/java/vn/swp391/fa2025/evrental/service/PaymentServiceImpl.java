package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.response.PaymentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.DashboardMetricsRequest;
import vn.swp391.fa2025.evrental.dto.request.TransactionFilterRequest;
import vn.swp391.fa2025.evrental.dto.response.DashboardMetricsResponse;
import vn.swp391.fa2025.evrental.dto.response.StationRevenueResponse;
import vn.swp391.fa2025.evrental.dto.response.TransactionResponse;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Payment;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.enums.BookingStatus;
import vn.swp391.fa2025.evrental.enums.PaymentMethod;
import vn.swp391.fa2025.evrental.enums.PaymentType;
import vn.swp391.fa2025.evrental.mapper.PaymentMapper;
import vn.swp391.fa2025.evrental.repository.BookingRepository;
import vn.swp391.fa2025.evrental.repository.PaymentRepository;
import vn.swp391.fa2025.evrental.repository.StationRepository;
import vn.swp391.fa2025.evrental.repository.UserRepository;
import vn.swp391.fa2025.evrental.util.BigDecimalUtils;
import vn.swp391.fa2025.evrental.util.EmailUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SystemConfigServiceImpl systemConfigService;

    @Autowired
    private EmailUtils emailUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentMapper paymentMapper;

    @Override
    public Page<TransactionResponse> getTransactions(TransactionFilterRequest request) {
        LocalDateTime start = request.getStartDate() != null ? request.getStartDate().atStartOfDay() : null;
        LocalDateTime end = request.getEndDate() != null ? request.getEndDate().atTime(23, 59, 59) : null;

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

        Page<Payment> payments = paymentRepository.searchTransactions(
                start,
                end,
                request.getStationId(),
                request.getPaymentType(),
                pageable
        );

        return payments.map(payment -> TransactionResponse.builder()
                .paymentId(payment.getPaymentId())
                .bookingId(payment.getBooking().getBookingId())
                .customerName(payment.getBooking().getUser().getFullName())
                .amount(payment.getAmount())
                .paymentType(payment.getPaymentType())
                .transactionDate(payment.getTransactionDate())
                .method(payment.getMethod())
                .referenceCode(payment.getReferenceCode())
                .stationName(payment.getBooking().getVehicle().getStation().getStationName())
                .build());
    }

    @Override
    @Transactional
    public void createPayment(Payment payment) {
        paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentByBookingIdAndType(Long bookingId, String paymentType) {
        return paymentRepository.findByBooking_BookingIdAndPaymentType(bookingId, PaymentType.fromString(paymentType));
    }

    @Override
    public List<StationRevenueResponse> getMonthlyRevenueByStation(int month, int year) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        
        // Get all payments in this month
        List<Payment> monthlyPayments = paymentRepository.findAllByTransactionDateBetween(startDate, endDate);
        if (monthlyPayments.isEmpty()) return Collections.emptyList();
        
        // Filter only payments with valid booking status (COMPLETED, CANCELLED, NO_SHOW)
        List<Payment> validPayments = monthlyPayments.stream()
                .filter(p -> {
                    Booking b = p.getBooking();
                    String status = b.getStatus().toString();
                    return "COMPLETED".equalsIgnoreCase(status) || "CANCELLED".equalsIgnoreCase(status) || "NO_SHOW".equalsIgnoreCase(status);
                })
                .collect(Collectors.toList());
        
        // Calculate revenue by station for THIS MONTH ONLY
        Map<Station, BigDecimal> revenueByStation = new HashMap<>();
        for (Payment p : validPayments) {
            Station station = p.getBooking().getVehicle().getStation();
            BigDecimal amount = switch (p.getPaymentType().toString()) {
                case "DEPOSIT", "FINAL_PAYMENT" -> p.getAmount();
                case "REFUND_DEPOSIT" -> p.getAmount().negate();
                default -> BigDecimal.ZERO;
            };
            revenueByStation.merge(station, amount, BigDecimal::add);
        }
        
        return revenueByStation.entrySet().stream()
                .map(e -> new StationRevenueResponse(
                        e.getKey().getStationId(),
                        e.getKey().getStationName(),
                        month,
                        year,
                        e.getValue()
                ))
                .sorted(Comparator.comparing(StationRevenueResponse::getStationId))
                .collect(Collectors.toList());
    }

    @Override
    public List<StationRevenueResponse> getYearlyRevenueByStation(String stationName, int year) {
        Station station=stationRepository.findByStationName(stationName);
        if (station == null) {throw new RuntimeException("Station không tồn tại");}
        List<StationRevenueResponse> result = new ArrayList<>();
        int currentMonth = (year == LocalDate.now().getYear())
                ? LocalDate.now().getMonthValue()
                : 12;
        for (int month = 1; month <= currentMonth; month++) {
            List<StationRevenueResponse> monthlyList = getMonthlyRevenueByStation(month, year);
            BigDecimal revenue = monthlyList.stream()
                    .filter(r -> Objects.equals(r.getStationName(), stationName))
                    .map(StationRevenueResponse::getRevenue)
                    .findFirst()
                    .orElse(BigDecimal.ZERO);
            result.add(new StationRevenueResponse(
                    station.getStationId(),
                    station.getStationName(),
                    month,
                    year,
                    revenue
            ));
        }
        return result;
    }

    @Transactional
    @Override
    public void refundCancelledBooking(Long bookingId, String referenceCode, LocalDateTime transactionDate) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (booking.getActualStartTime()==null && booking.getActualEndTime()!=null && booking.getStatus()== BookingStatus.CANCELLED) {
            if (paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), PaymentType.REFUND_DEPOSIT)!=null) throw new RuntimeException("Booking đã được hoàn tiền trước đó");
            Payment refund=null;
            if (paymentRepository.findByMethodAndReferenceCode(PaymentMethod.VIETCOMBANK, referenceCode)!=null) throw new RuntimeException("ReferenceCode đã tồn tại");
            if (transactionDate.isBefore(LocalDateTime.now().minusMinutes(10))) throw new RuntimeException("Thời gian giao dịch không được quá 10p so với thời điểm hiện tại");
            int minute = Integer.parseInt(systemConfigService.getSystemConfigByKey("CANCEL_BOOKING_REFUND_EXPIRE").getValue());
            if (booking.getStartTime().isAfter(booking.getActualEndTime().plusMinutes(minute))) {
                Payment deposit = paymentRepository.findByBooking_BookingIdAndPaymentType(booking.getBookingId(), PaymentType.fromString("DEPOSIT"));
                int extraRateInt = Integer.parseInt(systemConfigService.getSystemConfigByKey("REFUND").getValue());
                BigDecimal extraRate = BigDecimal.valueOf(extraRateInt).divide(BigDecimal.valueOf(100));
                refund = Payment.builder()
                        .booking(booking)
                        .transactionDate(transactionDate)
                        .paymentType(PaymentType.fromString("REFUND_DEPOSIT"))
                        .amount(BigDecimalUtils.roundUpToIntegerWithTwoDecimals(deposit.getAmount().multiply(extraRate)))
                        .referenceCode(referenceCode)
                        .method(PaymentMethod.fromString("VIETCOMBANK"))
                        .build();
                paymentRepository.save(refund);
                try {
                    emailUtils.sendRefundSuccessEmail(booking, refund.getAmount(), referenceCode);
                } catch (Exception e) {
                    System.err.println("Gửi email thông báo hoàn tiền thất bại: " + e.getMessage());
                }
            } else throw new RuntimeException("Booking không đạt điều kiện để refund");
        } else throw new RuntimeException("Không thể thực hiện refund trên booking này");
    }

    @Override
    public List<PaymentResponse> viewOwnPayment() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username);
        if (user==null) throw new RuntimeException("Không tìm thấy người dùng");
        List<Booking> userBookings = bookingRepository.findByUser_UserId(user.getUserId());
        Set<Long> bookingIds = userBookings.stream()
                .map(Booking::getBookingId)
                .collect(Collectors.toSet());
        List<Payment> payments = paymentRepository.findAllByBooking_BookingIdInOrderByTransactionDateDesc(bookingIds);
        return payments.stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }
  
    public DashboardMetricsResponse getDashboardMetrics(DashboardMetricsRequest request) {
        // Determine date range
        LocalDateTime startDate;
        LocalDateTime endDate;
        String period;
        
        if (request.getStartDate() != null && request.getEndDate() != null) {
            // Custom date range
            startDate = request.getStartDate().atStartOfDay();
            endDate = request.getEndDate().atTime(23, 59, 59);
            period = request.getStartDate() + " - " + request.getEndDate();
        } else if (request.getYear() != null && request.getMonth() != null) {
            // Specific month
            YearMonth yearMonth = YearMonth.of(request.getYear(), request.getMonth());
            startDate = yearMonth.atDay(1).atStartOfDay();
            endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
            period = "Tháng " + request.getMonth() + "/" + request.getYear();
        } else if (request.getYear() != null) {
            // Entire year
            startDate = LocalDateTime.of(request.getYear(), 1, 1, 0, 0, 0);
            endDate = LocalDateTime.of(request.getYear(), 12, 31, 23, 59, 59);
            period = "Năm " + request.getYear();
        } else {
            // Default: current month
            YearMonth currentMonth = YearMonth.now();
            startDate = currentMonth.atDay(1).atStartOfDay();
            endDate = currentMonth.atEndOfMonth().atTime(23, 59, 59);
            period = "Tháng " + currentMonth.getMonthValue() + "/" + currentMonth.getYear();
        }
        
        // Get all payments in the date range
        List<Payment> allPayments = paymentRepository.findAllByTransactionDateBetween(startDate, endDate);
        
        // Filter by station if specified
        if (request.getStationId() != null) {
            allPayments = allPayments.stream()
                    .filter(p -> p.getBooking().getVehicle().getStation().getStationId().equals(request.getStationId()))
                    .collect(Collectors.toList());
        }
        
        // Filter only payments with valid booking status (COMPLETED, CANCELLED, NO_SHOW)
        List<Payment> validPayments = allPayments.stream()
                .filter(p -> {
                    Booking b = p.getBooking();
                    String status = b.getStatus().toString();
                    return "COMPLETED".equalsIgnoreCase(status) 
                        || "CANCELLED".equalsIgnoreCase(status) 
                        || "NO_SHOW".equalsIgnoreCase(status);
                })
                .collect(Collectors.toList());
        
        // Calculate metrics
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalRefunds = BigDecimal.ZERO;
        
        for (Payment p : validPayments) {
            String paymentType = p.getPaymentType().toString();
            if ("DEPOSIT".equals(paymentType) || "FINAL_PAYMENT".equals(paymentType)) {
                totalRevenue = totalRevenue.add(p.getAmount());
            } else if ("REFUND_DEPOSIT".equals(paymentType)) {
                totalRefunds = totalRefunds.add(p.getAmount());
            }
        }
        
        BigDecimal netCashFlow = totalRevenue.subtract(totalRefunds);
        Long transactionCount = (long) validPayments.size();
        
        // Get station name if filtered by station
        String stationName = null;
        if (request.getStationId() != null) {
            Station station = stationRepository.findById(request.getStationId()).orElse(null);
            if (station != null) {
                stationName = station.getStationName();
            }
        }
        
        return DashboardMetricsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalRefunds(totalRefunds)
                .netCashFlow(netCashFlow)
                .transactionCount(transactionCount)
                .stationName(stationName)
                .period(period)
                .build();
    }
}
