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
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("username is not exits");
        }

        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User account is not active");
        }
        

        String token = jwtService.generateToken(username, user.getRole(), user.getFullName());
        return new LoginResponse(token);
    }
}
