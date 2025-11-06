package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.StationRevenueResponse;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Payment;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.repository.PaymentRepository;
import vn.swp391.fa2025.evrental.repository.StationRepository;

import java.math.BigDecimal;
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

    @Override
    public void createPayment(Payment payment) {
        paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentByBookingIdAndType(Long bookingId, String paymentType) {
        return paymentRepository.findByBooking_BookingIdAndPaymentType(bookingId, paymentType);
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
                    String status = b.getStatus();
                    return "COMPLETED".equalsIgnoreCase(status) || "CANCELLED".equalsIgnoreCase(status) || "NO_SHOW".equalsIgnoreCase(status);
                })
                .collect(Collectors.toList());

        // 5️⃣ Gom theo stationId
        Map<Station, BigDecimal> revenueByStation = new HashMap<>();

        for (Payment p : validPayments) {
            Station station = p.getBooking().getVehicle().getStation();
            BigDecimal amount = switch (p.getPaymentType()) {
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

        for (int month = 1; month <= 12; month++) {
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
}
