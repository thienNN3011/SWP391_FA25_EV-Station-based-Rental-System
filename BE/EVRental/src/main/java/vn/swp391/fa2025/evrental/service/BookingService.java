package vn.swp391.fa2025.evrental.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest;
import vn.swp391.fa2025.evrental.dto.response.AfterBookingResponse;
import vn.swp391.fa2025.evrental.dto.response.BookingResponse;
import vn.swp391.fa2025.evrental.dto.response.EndRentingResponse;
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
    Payment cancelBooking(Long bookingId);
    void cancelBookingForSystem(Long bookingId);
}
