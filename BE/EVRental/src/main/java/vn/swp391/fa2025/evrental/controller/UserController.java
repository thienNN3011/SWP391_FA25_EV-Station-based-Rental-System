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

    @PostMapping(value = "/users", consumes = MediaType.APPLICATION_JSON_VALUE) //fix de nhan json
public ResponseEntity<CustomerResponse> createUser(@RequestBody RegisterCustomerRequest req) {
    CustomerResponse res = registrationService.registerCustomer(req);
    return ResponseEntity.created(URI.create("/users/" + res.getUserId())).body(res);
}



    @GetMapping("/showpendingaccount")
    public ApiResponse<List<CustomerResponse>> showPendingAccount() {
        ApiResponse<List<CustomerResponse>> response = new ApiResponse<>();
        response.setData(userService.showPendingAccount());
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tài khoản đang chờ phê duyệt thành công");
        response.setCode(200);
        return response;
    }

    @PostMapping("/showdetailofpendingaccount")
    public ApiResponse<CustomerResponse> showDetailOfPendingAccount(@Valid @RequestBody ShowUserDetailRequest request) {
        ApiResponse<CustomerResponse> response = new ApiResponse<>();
        response.setData(userService.showDetailOfPendingAccount(request.getUsername()));
        response.setSuccess(true);
        response.setMessage("Lấy thông tin chi tiết tài khoản đang chờ phê duyệt thành công");
        response.setCode(200);
        return response;
    }

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

    @PutMapping("/updateuser")
    public ApiResponse<UserUpdateResponse> updateUser(@RequestBody UserUpdateRequest request) {
        // Lấy username từ token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();

        ApiResponse<UserUpdateResponse> response = new ApiResponse<>();
        response.setData(userService.updateUser(currentUsername, request));
        response.setSuccess(true);
        response.setMessage("Cập nhật thông tin user thành công");
        response.setCode(200);
        return response;
    }

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

    @GetMapping("/showuserinfo")
    public ApiResponse<CustomerResponse> showUserInfo() {
        // Lấy username từ token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        ApiResponse<CustomerResponse> response = new ApiResponse<>();
        response.setData(userService.showUserInfo(username));
        response.setSuccess(true);
        response.setMessage("Lấy thông tin user thành công");
        response.setCode(200);
        return response;
    }
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

    @PostMapping("/changestaffstationreq")
    public ApiResponse<ChangeStaffStationResponse> changeStaffStation(@Valid @RequestBody StationRequest request){
        ApiResponse<ChangeStaffStationResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(userService.listStaffInStation(request.getStationName()));
        response.setMessage("Lấy thông tin staff ở station thành công");
        response.setCode(200);
        return response;
    }

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

    @PostMapping("/showstaffstats")
    public ApiResponse<List<StaffStatsResponse>> showStaffStats(@Valid @RequestBody ShowStaffStatsRequest request){
        ApiResponse<List<StaffStatsResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(userService.getStaffStatsByStation(request.getStationName(), request.getMonth(), request.getYear()));
        response.setMessage("Lấy thống kê staff theo trạm thành công");
        response.setCode(200);
        return response;
    }

    @PostMapping("/showstaffstation")
    public ApiResponse<List<StaffResponse>> showStaffStation(@RequestBody StationRequest request){
        ApiResponse<List<StaffResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin staff theo trạm thành công");
        response.setCode(200);
        response.setData(userService.showStaffStation(request.getStationName()));
        return response;
    }

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

