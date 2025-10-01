package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.response.BookingResponse;
import vn.swp391.fa2025.evrental.entity.Booking;

@Service
public interface BookingService {
    public BookingResponse bookVehicle(BookingRequest bookingRequest);
}
