package vn.swp391.fa2025.evrental.controller;

import vn.swp391.fa2025.evrental.dto.request.ForgotPasswordRequest;
import vn.swp391.fa2025.evrental.dto.request.LoginRequest;
import vn.swp391.fa2025.evrental.dto.request.ResetPasswordRequest;
import vn.swp391.fa2025.evrental.dto.response.LoginResponse;
import vn.swp391.fa2025.evrental.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "Authentication", description = "Xác thực")
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Operation(summary = "Đăng nhập", description = "Xác thực và trả về JWT token")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticateUser(
            loginRequest.getUsername(),
            loginRequest.getPassword()
        );
        return ResponseEntity.ok(response);
    }
    @Operation(summary = "Đăng xuất", security = @SecurityRequirement(name = "Bearer Authentication"))
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Logout successful");
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
    @Operation(summary = "Quên mật khẩu", description = "Gửi email reset password")
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.requestPasswordReset(request.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));

        return ResponseEntity.ok(response);
    }




    @Operation(summary = "Đặt lại mật khẩu", description = "Reset password bằng token")
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Đặt lại mật khẩu thành công");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));

        return ResponseEntity.ok(response);
    }
}
