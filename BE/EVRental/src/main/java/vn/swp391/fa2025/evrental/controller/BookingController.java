package vn.swp391.fa2025.evrental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.response.BookingResponse;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.service.BookingServiceImpl;

@RestController
@RequestMapping("/bookings")
public class    BookingController {
    @Autowired
    private BookingServiceImpl bookingService;
    @PostMapping("/createbooking")
    ApiResponse<BookingResponse> createBooking(@RequestBody BookingRequest bookingRequest){
        ApiResponse<BookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo booking thành công");
        response.setData(bookingService.bookVehicle(bookingRequest));
        response.setCode(200);
        return response;
    }
}
