package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.response.StationRevenueResponse;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Payment;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.enums.BookingStatus;
import vn.swp391.fa2025.evrental.enums.PaymentMethod;
import vn.swp391.fa2025.evrental.enums.PaymentType;
import vn.swp391.fa2025.evrental.repository.BookingRepository;
import vn.swp391.fa2025.evrental.repository.PaymentRepository;
import vn.swp391.fa2025.evrental.repository.StationRepository;
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
        List<Payment> monthlyPayments = paymentRepository.findAllByTransactionDateBetween(startDate, endDate);
        if (monthlyPayments.isEmpty()) return Collections.emptyList();
        Set<Long> bookingIds = monthlyPayments.stream()
                .map(p -> p.getBooking().getBookingId())
                .collect(Collectors.toSet());
        List<Payment> allPaymentsOfBookings = paymentRepository.findAllByBooking_BookingIdIn(bookingIds);
        List<Payment> validPayments = allPaymentsOfBookings.stream()
                .filter(p -> {
                    Booking b = p.getBooking();
                    String status = b.getStatus().toString();
                    return "COMPLETED".equalsIgnoreCase(status) || "CANCELLED".equalsIgnoreCase(status) || "NO_SHOW".equalsIgnoreCase(status);
                })
                .collect(Collectors.toList());
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
}
