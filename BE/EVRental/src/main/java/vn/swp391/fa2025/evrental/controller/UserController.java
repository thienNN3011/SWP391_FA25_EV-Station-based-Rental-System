package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.*;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.service.RegistrationService;
import vn.swp391.fa2025.evrental.service.UserServiceImpl;
import vn.swp391.fa2025.evrental.service.UserStatsService;
import vn.swp391.fa2025.evrental.util.EmailUtils;

import java.net.URI;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@Tag(name = "User Management", description = "Quản lý người dùng")
@RestController
public class UserController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private UserStatsService userStatsService;

    @Autowired
    private EmailUtils emailUtils;

    @Operation(summary = "Đăng ký tài khoản", description = "Khách hàng đăng ký tài khoản mới")
    @PostMapping(value = "/users", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomerResponse> createUser(@RequestBody RegisterCustomerRequest req) {
        CustomerResponse res = registrationService.registerCustomer(req);
        return ResponseEntity.created(URI.create("/users/" + res.getUserId())).body(res);
    }

    @Operation(summary = "Xem tài khoản chờ duyệt", description = "Admin xem danh sách tài khoản pending")
    @GetMapping("/showpendingaccount")
    public ApiResponse<List<CustomerResponse>> showPendingAccount() {
        ApiResponse<List<CustomerResponse>> response = new ApiResponse<>();
        response.setData(userService.showPendingAccount());
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tài khoản đang chờ phê duyệt thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Chi tiết tài khoản chờ duyệt", description = "Admin xem chi tiết một tài khoản pending")
    @PostMapping("/showdetailofpendingaccount")
    public ApiResponse<CustomerResponse> showDetailOfPendingAccount(@Valid @RequestBody ShowUserDetailRequest request) {
        ApiResponse<CustomerResponse> response = new ApiResponse<>();
        response.setData(userService.showDetailOfPendingAccount(request.getUsername()));
        response.setSuccess(true);
        response.setMessage("Lấy thông tin chi tiết tài khoản đang chờ phê duyệt thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Thay đổi trạng thái tài khoản", description = "Admin duyệt/từ chối/khóa tài khoản")
    @PatchMapping("/changeaccountstatus")
    public ApiResponse<Boolean> changeAccountStatus(@Valid @RequestBody ChangeUserStatusRequest request) {
        ApiResponse<Boolean> response = new ApiResponse<>();
        String reason="";
        if (request.getReason()!=null) reason=request.getReason();
        response.setData(userService.changeAccountStatus(request.getUsername(), request.getStatus(), reason));
        response.setSuccess(true);
        response.setMessage("Thay đổi trạng thái tài khoản thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem tất cả staff", description = "Admin xem danh sách toàn bộ nhân viên")
    @GetMapping("/showallstaffs")
    public ApiResponse<List<StaffListResponse>> showAllStaffs() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        ApiResponse<List<StaffListResponse>> response = new ApiResponse<>();
        response.setData(userService.showAllStaffs(username));
        response.setSuccess(true);
        response.setMessage("Lấy thông tin toàn bộ staff thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Tạo tài khoản staff", description = "Admin tạo tài khoản nhân viên mới")
    @PostMapping(value = "/admin/staffs", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<StaffResponse> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        ApiResponse<StaffResponse> response = new ApiResponse<>();
        response.setData(userService.createStaff(username, request));
        response.setSuccess(true);
        response.setMessage("Tạo staff thành công");
        response.setCode(201);
        return response;
    }

    @Operation(summary = "Xem tất cả khách hàng", description = "Admin xem danh sách toàn bộ renter")
    @GetMapping("/showallrenters")
    public ApiResponse<List<RenterListResponse>> showAllRenters() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        ApiResponse<List<RenterListResponse>> response = new ApiResponse<>();
        response.setData(userService.showAllRenters(username));
        response.setSuccess(true);
        response.setMessage("Lấy thông tin toàn bộ renter thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Cập nhật thông tin user", description = "User cập nhật thông tin cá nhân")
    @PutMapping("/updateuser")
    public ApiResponse<UserUpdateResponse> updateUser(@RequestBody UserUpdateRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();

        ApiResponse<UserUpdateResponse> response = new ApiResponse<>();
        response.setData(userService.updateUser(currentUsername, request));
        response.setSuccess(true);
        response.setMessage("Cập nhật thông tin user thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xóa user", description = "Admin xóa tài khoản user")
    @DeleteMapping("/deleteuser/{username}")
    public ApiResponse<Boolean> deleteUser(@PathVariable String username) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();

        ApiResponse<Boolean> response = new ApiResponse<>();
        response.setData(userService.deleteUser(username, currentUsername));
        response.setSuccess(true);
        response.setMessage("Xóa user thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Thống kê hoạt động user", description = "User xem thống kê booking, km, thời gian thuê")
    @GetMapping("/users/me/stats")
    public ApiResponse<UserStatsResponse> getCurrentUserStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        UserStatsResponse stats = userStatsService.getCurrentUserStats(username);

        ApiResponse<UserStatsResponse> response = new ApiResponse<>();
        response.setData(stats);
        response.setSuccess(true);
        response.setMessage("Lấy thống kê hoạt động thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem thông tin cá nhân", description = "User xem thông tin tài khoản của mình")
    @GetMapping("/showuserinfo")
    public ApiResponse<CustomerResponse> showUserInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        ApiResponse<CustomerResponse> response = new ApiResponse<>();
        response.setData(userService.showUserInfo(username));
        response.setSuccess(true);
        response.setMessage("Lấy thông tin user thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Cập nhật tài khoản bị từ chối", description = "User cập nhật lại thông tin sau khi bị reject")
    @PutMapping("/updaterejecteduser")
    public ApiResponse<String> updateRejectedUser(@RequestBody UserRejectedUpdateRequest request) {
        userService.updateRejectedUser(request);
        ApiResponse<String> response = new ApiResponse<>();
        response.setData(null);
        response.setSuccess(true);
        response.setMessage("Đã cập nhật thông tin và chuyển sang trạng thái chờ duyệt");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Danh sách staff tại trạm", description = "Lấy thông tin staff ở một trạm để chuyển đổi")
    @PostMapping("/changestaffstationreq")
    public ApiResponse<ChangeStaffStationResponse> changeStaffStation(@Valid @RequestBody StationRequest request){
        ApiResponse<ChangeStaffStationResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(userService.listStaffInStation(request.getStationName()));
        response.setMessage("Lấy thông tin staff ở station thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Chuyển staff sang trạm khác", description = "Admin chuyển nhân viên sang trạm mới")
    @PostMapping("/dochangestaffstation")
    public ApiResponse<String> doChangeStaffStation(@Valid @RequestBody ChangeStaffStationRequest request) {
        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setCode(200);
        String stationName = userService.getUserById(request.getStaffId()).getStation().getStationName();
        User staff = userService.changeStaffStation(request.getStationName(), request.getStaffId());
        response.setMessage("Thay đổi thành công");
        String dataMessage = String.format(
                "Đã thay đổi nhân viên '%s' (ID: %d) từ trạm '%s' sang trạm '%s'.",
                staff.getFullName(),
                staff.getUserId(),
                stationName,
                staff.getStation().getStationName()
        );
        emailUtils.sendStaffStationChangedEmail(staff, staff.getStation().getStationName(), staff.getStation().getAddress());
        response.setData(dataMessage);
        return response;
    }

    @Operation(summary = "Thống kê staff theo trạm", description = "Xem hiệu suất làm việc của staff tại trạm")
    @PostMapping("/showstaffstats")
    public ApiResponse<List<StaffStatsResponse>> showStaffStats(@Valid @RequestBody ShowStaffStatsRequest request){
        ApiResponse<List<StaffStatsResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(userService.getStaffStatsByStation(request.getStationName(), request.getMonth(), request.getYear()));
        response.setMessage("Lấy thống kê staff theo trạm thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem staff theo trạm", description = "Admin xem tất cả staff làm việc tại một trạm")
    @PostMapping("/showstaffstation")
    public ApiResponse<List<StaffResponse>> showStaffStation(@RequestBody StationRequest request){
        ApiResponse<List<StaffResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin staff theo trạm thành công");
        response.setCode(200);
        response.setData(userService.showStaffStation(request.getStationName()));
        return response;
    }

    @Operation(summary = "Danh sách user rủi ro cao", description = "Admin xem user có nhiều vi phạm")
    @GetMapping("/usersrisk")
    public ApiResponse<List<UserRiskResponse>> getUsersAtRisk() {
        ApiResponse<List<UserRiskResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy danh sách người dùng có rủi ro cao thành công");
        response.setCode(200);
        response.setData(userService.getUsersAtRisk());
        return response;
    }
}

