package vn.swp391.fa2025.evrental.controller;

import vn.swp391.fa2025.evrental.dto.request.LoginRequest;
import vn.swp391.fa2025.evrental.dto.response.LoginResponse;
import vn.swp391.fa2025.evrental.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for handling authentication endpoints
 */
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * Login endpoint for user authentication
     * @param loginRequest the login credentials
     * @return ResponseEntity with login response or error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        try {
            // Authenticate user
            LoginResponse response = authService.authenticateUser(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            );
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Handle authentication failures
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
