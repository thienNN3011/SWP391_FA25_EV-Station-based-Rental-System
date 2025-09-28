package vn.swp391.fa2025.evrental.controller;

import vn.swp391.fa2025.evrental.dto.request.LoginRequest;
import vn.swp391.fa2025.evrental.dto.response.LoginResponse;
import vn.swp391.fa2025.evrental.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;


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
}
