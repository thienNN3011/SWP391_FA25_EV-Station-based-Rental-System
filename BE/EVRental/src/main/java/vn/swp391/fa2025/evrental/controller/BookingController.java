package vn.swp391.fa2025.evrental.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.servlet.http.HttpServletResponse;
import vn.swp391.fa2025.evrental.dto.request.*;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.service.BookingServiceImpl;
import vn.swp391.fa2025.evrental.service.ContractServiceImpl;
import vn.swp391.fa2025.evrental.util.EmailUtils;

import java.math.BigDecimal;
import java.util.List;
import java.io.IOException;

@Tag(name = "Booking Management", description = "Quản lý đặt xe")
@RestController
@RequestMapping("/bookings")
public class BookingController {
    @Autowired
    private BookingServiceImpl bookingService;
    @Autowired
    private ContractServiceImpl contractService;
    @Autowired
    private EmailUtils emailUtils;
    
    @Operation(summary = "Tạo booking mới", description = "Khách hàng đặt xe")
    @PostMapping("/createbooking")
    ApiResponse<AfterBookingResponse> createBooking(HttpServletRequest request, @Valid @RequestBody BookingRequest bookingRequest){
        ApiResponse<AfterBookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo booking thành công");
        response.setData(bookingService.bookVehicle(request, bookingRequest));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem booking theo trạng thái", description = "Staff xem danh sách booking theo status")
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

    @Operation(summary = "Xem booking theo trạng thái (Phân trang)", description = "Lấy danh sách booking với phân trang và tìm kiếm")
    @PostMapping("/showbookingbystatus/paged")
    ApiResponse<PagedBookingResponse> showBookingByStatusPaged(@Valid @RequestBody vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest request) {
        ApiResponse<PagedBookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        PagedBookingResponse data = bookingService.getBookingByStatusPaged(request);
        if (data.getBookings().isEmpty()) {
            response.setMessage("Không có booking nào với trạng thái đã cho");
        } else {
            response.setMessage("Lấy thông tin booking theo trạng thái thành công");
        }
        response.setData(data);
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem chi tiết booking", description = "Lấy thông tin chi tiết một booking")
    @PostMapping("/showdetailbooking")
    ApiResponse<BookingResponse> showBookingDetail(@Valid @RequestBody vn.swp391.fa2025.evrental.dto.request.ShowBookingRequest request) {
        ApiResponse<BookingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin chi tiết booking thành công");
        response.setData(bookingService.getBookingById(request.getBookingId()));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Bắt đầu thuê xe", description = "Staff xác nhận bắt đầu cho thuê")
    @PostMapping("/startrental")
    ApiResponse<String> startRental(@Valid @RequestBody StartRentingRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Bắt đầu thuê xe thành công");
        response.setData(bookingService.startRental(request.getBookingId(), request.getVehicleStatus(), request.getStartOdo()));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xác nhận booking", description = "Khách hàng xác nhận hợp đồng qua email")
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

    @Operation(summary = "Từ chối booking", description = "Khách hàng từ chối hợp đồng qua email")
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

    @Operation(summary = "Kết thúc thuê xe", description = "Staff xác nhận kết thúc và tính tiền")
    @PostMapping("/endrental")
    ApiResponse<EndRentingResponse> endRental(HttpServletRequest req, @Valid @RequestBody EndRentingRequest request) {
        ApiResponse<EndRentingResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Kết thúc thuê xe thành công");
        response.setData(bookingService.endRental(req, request.getBookingId(), request.getVehicleStatus(), request.getEndOdo()));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Hủy booking", description = "Khách hàng hủy booking và nhận hoàn tiền")
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

    @Operation(summary = "Dừng tính thời gian thuê", description = "Dừng đồng hồ tính giờ thuê xe")
    @PostMapping("/stoprentingtime")
    ApiResponse<StopRentingTimeResponse> stopRentingTime(@Valid @RequestBody StopRentingRequest request) {
        ApiResponse<StopRentingTimeResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Dừng thời gian thuê thành công");
        response.setData(bookingService.endTimeRenting(request.getBookingId()));
        response.setCode(200);
        return response;
    }
    @Operation(summary = "Tổng doanh thu của user", description = "Tính tổng tiền từ tất cả booking đã hoàn thành")
    @GetMapping("/total-revenue")
    ApiResponse<BigDecimal> getTotalRevenue() {
        ApiResponse<BigDecimal> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tổng số tiền của các booking");
        response.setData(bookingService.getMyTotalRevenue());
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Danh sách booking cần hoàn tiền", description = "Lấy các booking đã hủy cần hoàn trả")
    @GetMapping("/showbookingsrefund")
    ApiResponse<List<BookingRefundResponse>> showBookingsRefund(){
        ApiResponse<List<BookingRefundResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setData(bookingService.listCancelledBookingRefund());
        response.setSuccess(true);
        response.setMessage("Lấy các booking cần hoàn trả thành công");
        return response;
    }

    @Operation(summary = "Kiểm tra điều kiện hoàn tiền", description = "Kiểm tra booking có được hoàn tiền khi hủy không")
    @PostMapping("/isrefund")
    ApiResponse<Boolean> isRefundWhenCancel(@Valid @RequestBody StopRentingRequest request){
        ApiResponse<Boolean> response= new ApiResponse<>();
        response.setSuccess(true);
        response.setData(bookingService.isRefundWhenCancel(request.getBookingId()));
        response.setMessage("Kiểm tra thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Cập nhật xe cho booking", description = "Thay đổi xe được gán cho booking")
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

    @Operation(summary = "Staff hủy booking", description = "Staff hủy booking thay khách hàng")
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

    @Operation(summary = "Thống kê booking theo tháng", description = "Lấy số lượng booking hoàn thành theo tháng/năm")
    @PostMapping("/stats/monthly-completed")
    ApiResponse<MonthlyBookingStatsResponse> getMonthlyCompletedBookingsStats(
            @Valid @RequestBody MonthlyBookingStatsRequest request) {
        ApiResponse<MonthlyBookingStatsResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setCode(200);
        MonthlyBookingStatsResponse data = bookingService.getMonthlyCompletedBookingsStats(request);

        if (data.getTotalCompletedBookings() == 0) {
            response.setMessage("Không có booking hoàn thành nào trong tháng " +
                    request.getMonth() + "/" + request.getYear());
        } else {
            String stationInfo = request.getStationId() != null ?
                    " tại trạm " + data.getStationName() : " (tất cả trạm)";
            response.setMessage("Lấy thống kê booking hoàn thành tháng " +
                    request.getMonth() + "/" + request.getYear() + stationInfo + " thành công");
        }

        response.setData(data);
        return response;
    }

    @Operation(summary = "Thống kê booking theo năm", description = "Lấy số lượng booking hoàn thành theo năm")
    @PostMapping("/stats/yearly-completed")
    public ApiResponse<List<StationCompletedBookingsResponse>> getYearlyCompletedBookingsStats(
            @Valid @RequestBody StationCompletedBookingsRequest request) {
        ApiResponse<List<StationCompletedBookingsResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(bookingService.getYearlyCompletedBookingsByStation(
                request.getStationName(),
                request.getYear()
        ));
        response.setCode(200);
        response.setMessage("Thống kê booking hoàn thành theo năm thành công");
        return response;
    }

    @Operation(summary = "Lấy expected Total Amount", description = "Lấy expected Total Amount")
    @GetMapping("/expectedtotal/{bookingId}")
    public ApiResponse<BigDecimal> getExpectedTotalAmount(@PathVariable Long bookingId) {
        ApiResponse<BigDecimal> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy expected Total Amount thanh cong");
        response.setData(bookingService.getExpectedAmount(bookingId));
        response.setCode(200);
        return response;
    }
}
