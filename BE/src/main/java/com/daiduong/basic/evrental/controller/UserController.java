package com.daiduong.basic.evrental.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for user-related endpoints (protected)
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    /**
     * Get user profile - Protected endpoint for testing JWT
     * @return ResponseEntity with user profile information
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        // Get authentication from SecurityContext (set by JWT filter)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // Extract user info from authentication
        String username = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // Create response
        Map<String, Object> profile = new HashMap<>();
        profile.put("username", username);
        profile.put("role", role); // Clean role without prefix
        profile.put("message", "Profile retrieved successfully");
        profile.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(profile);
    }

    /**
     * Test authentication endpoint - Simple protected endpoint
     * @return ResponseEntity with test message
     */
    @GetMapping("/test")
    public ResponseEntity<?> testAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "JWT Authentication working!");
        response.put("user", authentication.getName());
        response.put("authenticated", authentication.isAuthenticated());
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
}
