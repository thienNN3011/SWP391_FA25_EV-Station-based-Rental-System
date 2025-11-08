package vn.swp391.fa2025.evrental.controller;

import vn.swp391.fa2025.evrental.dto.request.ForgotPasswordRequest;
import vn.swp391.fa2025.evrental.dto.request.LoginRequest;
import vn.swp391.fa2025.evrental.dto.request.ResetPasswordRequest;
import vn.swp391.fa2025.evrental.dto.response.LoginResponse;
import vn.swp391.fa2025.evrental.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * Login endpoint for user authentication
     * @param loginRequest the login credentials (validated automatically)
     * @return ResponseEntity with login response
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Authenticate user - exceptions will be handled by GlobalExceptionHandler
        LoginResponse response = authService.authenticateUser(
            loginRequest.getUsername(),
            loginRequest.getPassword()
        );
        return ResponseEntity.ok(response);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Logout successful");
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.requestPasswordReset(request.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));

        return ResponseEntity.ok(response);
    }




    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request.getToken(), request.getNewPassword());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Đặt lại mật khẩu thành công");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));

        return ResponseEntity.ok(response);
    }
}
