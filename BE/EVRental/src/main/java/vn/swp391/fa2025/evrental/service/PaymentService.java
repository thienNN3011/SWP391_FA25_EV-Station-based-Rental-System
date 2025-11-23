package vn.swp391.fa2025.evrental.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.DashboardMetricsRequest;
import vn.swp391.fa2025.evrental.dto.request.TransactionFilterRequest;
import vn.swp391.fa2025.evrental.dto.response.DashboardMetricsResponse;
import vn.swp391.fa2025.evrental.dto.response.StationRevenueResponse;
import vn.swp391.fa2025.evrental.dto.response.TransactionResponse;
import vn.swp391.fa2025.evrental.entity.Payment;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface PaymentService {
    public void createPayment(Payment payment);
    Payment getPaymentByBookingIdAndType(Long bookingId, String paymentType);
    List<StationRevenueResponse> getMonthlyRevenueByStation(int month, int year);
    List<StationRevenueResponse> getYearlyRevenueByStation(String stationName, int year);
    public void refundCancelledBooking(Long bookingId, String referenceCode, LocalDateTime transactionDate);
    Page<TransactionResponse> getTransactions(TransactionFilterRequest request);
    DashboardMetricsResponse getDashboardMetrics(DashboardMetricsRequest request);
}
