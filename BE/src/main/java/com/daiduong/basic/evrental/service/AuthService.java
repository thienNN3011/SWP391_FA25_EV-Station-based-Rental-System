package com.daiduong.basic.evrental.service;

import com.daiduong.basic.evrental.dto.reponse.LoginResponse;
import com.daiduong.basic.evrental.entity.User;
import com.daiduong.basic.evrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class for handling authentication operations
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;
    
    /**
     * Authenticates a user with username and password
     * @param username the username to authenticate
     * @param password the raw password to verify
     * @return LoginResponse with user information if authentication successful
     * @throws RuntimeException if authentication fails
     */
    public LoginResponse authenticateUser(String username, String password) {
        // Find user by username
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Verify password (simple comparison for learning purposes)
        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Check if user is active
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User account is not active");
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(
            user.getUsername(),
            user.getRole()
        );

        // Create and return login response with JWT token only
        return new LoginResponse(token);
    }
}
