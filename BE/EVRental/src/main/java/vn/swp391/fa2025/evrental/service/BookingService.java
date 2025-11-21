package vn.swp391.fa2025.evrental.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.request.MonthlyBookingStatsRequest;
import vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest;
import vn.swp391.fa2025.evrental.dto.request.StationCompletedBookingsRequest;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public interface BookingService {
    AfterBookingResponse bookVehicle(HttpServletRequest req, BookingRequest bookingRequest);
    List<BookingResponse> getBookingByStatus(ShowBookingRequest request);
    BookingResponse getBookingById(Long id);
    String startRental(Long bookingId, String vehicleStatus, Long startOdo);
    EndRentingResponse endRental(HttpServletRequest request, Long bookingId, String vehicleStatus, Long endOdo, LocalDateTime transactionDate, String referanceCode);
    Booking findById(Long id);
    void updateBooking(Booking booking);
    Payment cancelBooking(Long bookingId, String bankName, String bankAccount);
    void cancelBookingForSystem(Long bookingId);
    StopRentingTimeResponse endTimeRenting(Long bookingId);
    BigDecimal getMyTotalRevenue();
    List<BookingRefundResponse> listCancelledBookingRefund();
    boolean isRefundWhenCancel(Long bookingId);
    void updateBookingVehicle(Long bookingId, Long vehicleId);
    void cancelBookingForStaff(Long bookingId, String referenceCode, LocalDateTime transactionDate, String reason);

    // New method for monthly completed bookings statistics
    MonthlyBookingStatsResponse getMonthlyCompletedBookingsStats(MonthlyBookingStatsRequest request);

    // New method for yearly completed bookings statistics by station
    List<StationCompletedBookingsResponse> getYearlyCompletedBookingsByStation(String stationName, int year);
}
