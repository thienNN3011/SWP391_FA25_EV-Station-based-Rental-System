package vn.swp391.fa2025.evrental.controller;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.request.StartRentingRequest;
import vn.swp391.fa2025.evrental.dto.response.BookingResponse;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.entity.Contract;
import vn.swp391.fa2025.evrental.service.BookingServiceImpl;
import vn.swp391.fa2025.evrental.service.ContractServiceImpl;
import vn.swp391.fa2025.evrental.util.EmailUtils;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    @Autowired
    private BookingServiceImpl bookingService;
    @Autowired
    private ContractServiceImpl contractService;
    @Autowired
    private EmailUtils emailUtils;
    
    @PostMapping("/createbooking")
    ApiResponse<BookingResponse> createBooking(@RequestBody BookingRequest bookingRequest){
        ApiResponse<BookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo booking thành công");
        response.setData(bookingService.bookVehicle(bookingRequest));
        response.setCode(200);
        return response;
    }
    @PostMapping("/showbookingbystatus")
    ApiResponse<java.util.List<BookingResponse>> showBookingByStatusForStaff(@RequestBody vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest request) {
        ApiResponse<java.util.List<BookingResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        List<BookingResponse> data = bookingService.getBookingByStatus(request);
        if (data.isEmpty()) {
            response.setMessage("Không có booking nào với trạng thái đã cho");
        } else {
            response.setMessage("Lấy thông tin booking theo trạng thái thành công");
            response.setData(bookingService.getBookingByStatus(request));
        }
        response.setCode(200);
        return response;
    }
    @PostMapping("showdetailbooking")
    ApiResponse<BookingResponse> showBookingDetail(@RequestBody vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest request) {
        ApiResponse<BookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin chi tiết booking thành công");
        response.setData(bookingService.getBookingById(request.getBookingId()));
        response.setCode(200);
        return response;
    }

    @PostMapping("startrental")
    ApiResponse<String> startRental(@RequestBody StartRentingRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Bắt đầu thuê xe thành công");
        response.setData(bookingService.startRental(request.getBookingId(), request.getVehicleStatus(), request.getStarOdo()));
        response.setCode(200);
        return response;
    }

    @GetMapping("/confirm")
    public ApiResponse<String> confirmBooking(@RequestParam("token") String token){
        ApiResponse<String> response = new ApiResponse<>();
        try {
            String result = contractService.confirmContract(token);
            response.setSuccess(true);
            response.setMessage("Xác nhận hợp đồng thành công");
            response.setData(result);
            response.setCode(200);
        } catch (RuntimeException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            response.setCode(400);
        }
        return response;
    }

    @GetMapping("/reject")
    public ApiResponse<String> rejectBooking(@RequestParam("token") String token) {
        ApiResponse<String> response = new ApiResponse<>();
        try {
            String result = contractService.rejectContract(token);
            response.setSuccess(true);
            response.setMessage("Hủy hợp đồng thành công");
            response.setData(result);
            response.setCode(200);
        } catch (RuntimeException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            response.setCode(400);
        }
        return response;
    }
}
