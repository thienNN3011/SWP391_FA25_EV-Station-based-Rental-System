package vn.swp391.fa2025.evrental.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.request.CancelBookingRequest;
import vn.swp391.fa2025.evrental.dto.request.EndRentingRequest;
import vn.swp391.fa2025.evrental.dto.request.StartRentingRequest;
import vn.swp391.fa2025.evrental.dto.response.AfterBookingResponse;
import vn.swp391.fa2025.evrental.dto.response.BookingResponse;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.EndRentingResponse;
import vn.swp391.fa2025.evrental.entity.Contract;
import vn.swp391.fa2025.evrental.service.BookingServiceImpl;
import vn.swp391.fa2025.evrental.service.ContractServiceImpl;
import vn.swp391.fa2025.evrental.util.EmailUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.io.IOException;
import java.net.URLEncoder;


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
    ApiResponse<AfterBookingResponse> createBooking(HttpServletRequest request, @RequestBody BookingRequest bookingRequest){
        ApiResponse<AfterBookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo booking thành công");
        response.setData(bookingService.bookVehicle(request, bookingRequest));
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
    @PostMapping("/showdetailbooking")
    ApiResponse<BookingResponse> showBookingDetail(@RequestBody vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest request) {
        ApiResponse<BookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin chi tiết booking thành công");
        response.setData(bookingService.getBookingById(request.getBookingId()));
        response.setCode(200);
        return response;
    }

    @PostMapping("/startrental")
    ApiResponse<String> startRental(@RequestBody StartRentingRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Bắt đầu thuê xe thành công");
        response.setData(bookingService.startRental(request.getBookingId(), request.getVehicleStatus(), request.getStartOdo()));
        response.setCode(200);
        return response;
    }

    @GetMapping("/confirm")
public ApiResponse<String> confirmBooking(@RequestParam("token") String token) {
    ApiResponse<String> response = new ApiResponse<>();
    try {
        String result = contractService.confirmContract(token);
        response.setSuccess(true);
        response.setMessage("Hợp đồng đã được xác nhận thành công");
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

    @PostMapping("/endrental")
    ApiResponse<EndRentingResponse> endRental(HttpServletRequest req, @RequestBody EndRentingRequest request) {
        ApiResponse<EndRentingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Kết thúc thuê xe thành công");
        response.setData(bookingService.endRental(req, request.getBookingId(), request.getVehicleStatus(), request.getEndOdo(), request.getTransactionDate(), request.getReferenceCode()));
        response.setCode(200);
        return response;
    }

    @PostMapping("/cancelbooking")
    ApiResponse<String> cancelRental(@RequestBody CancelBookingRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Hủy booking thành công");
        bookingService.cancelBooking(request.getBookingId());
        response.setData("Hủy booking thành công");
        response.setCode(200);
        return response;
    }
}
