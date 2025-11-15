package vn.swp391.fa2025.evrental.controller;

import com.beust.ah.A;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import vn.swp391.fa2025.evrental.dto.request.*;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.Contract;
import vn.swp391.fa2025.evrental.service.BookingServiceImpl;
import vn.swp391.fa2025.evrental.service.ContractServiceImpl;
import vn.swp391.fa2025.evrental.util.EmailUtils;

import java.math.BigDecimal;
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
    ApiResponse<AfterBookingResponse> createBooking(HttpServletRequest request, @Valid @RequestBody BookingRequest bookingRequest){
        ApiResponse<AfterBookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo booking thành công");
        response.setData(bookingService.bookVehicle(request, bookingRequest));
        response.setCode(200);
        return response;
    }
    @PostMapping("/showbookingbystatus")
    ApiResponse<java.util.List<BookingResponse>> showBookingByStatusForStaff(@Valid @RequestBody vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest request) {
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
    ApiResponse<BookingResponse> showBookingDetail(@Valid @RequestBody vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest request) {
        ApiResponse<BookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin chi tiết booking thành công");
        response.setData(bookingService.getBookingById(request.getBookingId()));
        response.setCode(200);
        return response;
    }

    @PostMapping("/startrental")
    ApiResponse<String> startRental(@Valid @RequestBody StartRentingRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Bắt đầu thuê xe thành công");
        response.setData(bookingService.startRental(request.getBookingId(), request.getVehicleStatus(), request.getStartOdo()));
        response.setCode(200);
        return response;
    }

    @GetMapping("/confirm")
    public void confirmBooking(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        response.setContentType("text/html;charset=UTF-8");
        try {
            String html = contractService.confirmContract(token);
            response.getWriter().write(html);
        } catch (RuntimeException e) {
            response.getWriter().write("<h2>Lỗi: " + e.getMessage() + "</h2>");
        }
    }



    @GetMapping("/reject")
    public void rejectBooking(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        response.setContentType("text/html;charset=UTF-8");
        try {
            String html = contractService.rejectContract(token);
            response.getWriter().write(html);
        } catch (RuntimeException e) {
            response.getWriter().write("<h2>Lỗi: " + e.getMessage() + "</h2>");
        }
    }

    @PostMapping("/endrental")
    ApiResponse<EndRentingResponse> endRental(HttpServletRequest req, @Valid @RequestBody EndRentingRequest request) {
        ApiResponse<EndRentingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Kết thúc thuê xe thành công");
        response.setData(bookingService.endRental(req, request.getBookingId(), request.getVehicleStatus(), request.getEndOdo(), request.getTransactionDate(), request.getReferenceCode()));
        response.setCode(200);
        return response;
    }

    @PostMapping("/cancelbooking")
    ApiResponse<String> cancelRental(@Valid @RequestBody CancelBookingRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Hủy booking thành công");
        if (bookingService.cancelBooking(request.getBookingId(), request.getBankName(), request.getBankAccount())!=null) response.setData("Hủy booking thành công. Đã hoàn lại 70% số tiền đặt cọc cho khách hàng!");
        else response.setData("Hủy booking thành công. Quý khách không được hoàn tiền vì hủy sau thời gian quy định");
        response.setCode(200);
        return response;
    }

    @PostMapping("/stoprentingtime")
    ApiResponse<String> stopRentingTime(@Valid @RequestBody StopRentingRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        bookingService.endTimeRenting(request.getBookingId());
        response.setSuccess(true);
        response.setMessage("Dừng thời gian thuê thành công");
        response.setData("Dừng thời gian thuê thành công");
        response.setCode(200);
        return response;
    }
    @GetMapping("/total-revenue")
    ApiResponse<BigDecimal> getTotalRevenue() {
        ApiResponse<BigDecimal> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tổng số tiền của các booking");
        response.setData(bookingService.getMyTotalRevenue());
        response.setCode(200);
        return response;
    }

    @GetMapping("/showbookingsrefund")
    ApiResponse<List<BookingRefundResponse>> showBookingsRefund(){
        ApiResponse<List<BookingRefundResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setData(bookingService.listCancelledBookingRefund());
        response.setSuccess(true);
        response.setMessage("Lấy các booking cần hoàn trả thành công");
        return response;
    }

    @PostMapping("/isrefund")
    ApiResponse<Boolean> isRefundWhenCancel(@Valid @RequestBody StopRentingRequest request){
        ApiResponse<Boolean> response= new ApiResponse<>();
        response.setSuccess(true);
        response.setData(bookingService.isRefundWhenCancel(request.getBookingId()));
        response.setMessage("Kiểm tra thành công");
        response.setCode(200);
        return response;
    }

    @PostMapping("/updatebookingvehicle")
    ApiResponse<String> updateBookingVehicle(@Valid @RequestBody UpdateBookingVehicleRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setMessage("Cập nhật thành công");
        response.setSuccess(true);
        response.setCode(200);
        bookingService.updateBookingVehicle(request.getBookingId(), request.getVehicleId());
        response.setData("Cập nhật thành công");
        return response;
    }

    @PostMapping("/cancelbookingbystaff")
    ApiResponse<String> cancelBookingByStaff(@Valid @RequestBody CancelBookingByStaffRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setData("Booking đã được hủy");
        response.setSuccess(true);
        bookingService.cancelBookingForStaff(request.getBookingId(), request.getReferenceCode(), request.getTransactionDate(), request.getReason());
        response.setMessage("Booking đã đươợc hủy");
        response.setCode(200);
        return response;
    }
}
