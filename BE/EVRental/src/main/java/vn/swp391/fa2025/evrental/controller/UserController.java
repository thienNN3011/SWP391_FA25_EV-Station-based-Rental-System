package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.ChangeUserStatusRequest;
import vn.swp391.fa2025.evrental.dto.request.RegisterCustomerRequest;
import vn.swp391.fa2025.evrental.dto.request.ShowUserDetailRequest;
import vn.swp391.fa2025.evrental.dto.request.UpdateUserRequest;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.CustomerResponse;
import vn.swp391.fa2025.evrental.dto.response.UpdateUserResponse;
import vn.swp391.fa2025.evrental.dto.response.UserListResponse;
import vn.swp391.fa2025.evrental.service.RegistrationService;
import vn.swp391.fa2025.evrental.service.UserServiceImpl;

import java.net.URI;
import java.util.List;

@RestController
public class UserController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserServiceImpl userService;

    @PostMapping(value = "/users", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomerResponse> createUser(@Valid @ModelAttribute RegisterCustomerRequest req) {
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
    public ApiResponse<CustomerResponse> showDetailOfPendingAccount(@RequestBody ShowUserDetailRequest request) {
        ApiResponse<CustomerResponse> response = new ApiResponse<>();
        response.setData(userService.showDetailOfPendingAccount(request.getUsername()));
        response.setSuccess(true);
        response.setMessage("Lấy thông tin chi tiết tài khoản đang chờ phê duyệt thành công");
        response.setCode(200);
        return response;
    }

    @PatchMapping("/changeaccountstatus")
    public ApiResponse<Boolean> changeAccountStatus(@RequestBody ChangeUserStatusRequest request) {
        ApiResponse<Boolean> response = new ApiResponse<>();
        response.setData(userService.changeAccountStatus(request.getUsername(), request.getStatus()));
        response.setSuccess(true);
        response.setMessage("Thay đổi trạng thái tài khoản thành công");
        response.setCode(200);
        return response;
    }
    @GetMapping("/showallusers")
    public ApiResponse<List<UserListResponse>> showAllUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        ApiResponse<List<UserListResponse>> response = new ApiResponse<>();
        response.setData(userService.showAllUsers(username));
        response.setSuccess(true);
        response.setMessage("Lấy thông tin toàn bộ user thành công");
        response.setCode(200);
        return response;
    }

    @PutMapping("/updateuser")
    public ApiResponse<UpdateUserResponse> updateUser(@Valid @RequestBody UpdateUserRequest request) {
        // Lấy username từ token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();

        ApiResponse<UpdateUserResponse> response = new ApiResponse<>();
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
}

