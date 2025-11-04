package vn.swp391.fa2025.evrental.service;

import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Autowired
    private PasswordEncoder passwordEncoder;
    
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
            throw new RuntimeException("Tên tài khoản không tồn tại");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai tên tài khoản hoặc mật khẩu");
        }
        if("REJECTED".equalsIgnoreCase(user.getStatus())){
            throw new RuntimeException("Thông tin tài khoản của quý khách không phù hợp xin vui lòng cập nhật lại");
        }
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Tài khoản quý khách chưa được duyệt");
        }
        

        String token = jwtService.generateToken(username, user.getRole(), user.getFullName());
        return new LoginResponse(token);
    }
}
