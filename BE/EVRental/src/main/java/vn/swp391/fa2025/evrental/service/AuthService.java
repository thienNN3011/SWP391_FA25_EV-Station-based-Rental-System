package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.response.LoginResponse;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for handling authentication operations
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
        // In production, use BCrypt or similar password hashing
        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(username, user.getRole());
        return new LoginResponse(token);
    }
}
