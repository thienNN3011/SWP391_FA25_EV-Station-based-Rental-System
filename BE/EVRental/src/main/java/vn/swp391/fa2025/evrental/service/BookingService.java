package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest;
import vn.swp391.fa2025.evrental.dto.response.BookingResponse;
import vn.swp391.fa2025.evrental.entity.Booking;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface BookingService {
    public BookingResponse bookVehicle(BookingRequest bookingRequest);
    public List<BookingResponse> getBookingByStatus(ShowBookingRequest request);
    public BookingResponse getBookingById(Long id);
    String startRental(Long bookingId, String vehicleStatus, Long startOdo);
}
