package vn.swp391.fa2025.evrental.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import vn.swp391.fa2025.evrental.dto.response.LoginResponse;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.util.EmailUtils;

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

    @Autowired
    private EmailUtils emailUtils;
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
        if("REJECTED".equalsIgnoreCase(user.getStatus().toString())){
            throw new RuntimeException("Thông tin tài khoản của quý khách không phù hợp xin vui lòng cập nhật lại");
        }
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus().toString())) {
            throw new RuntimeException("Tài khoản quý khách chưa được duyệt");
        }
        

        String token = jwtService.generateToken(username, user.getRole().toString(), user.getFullName());
        return new LoginResponse(token);
    }

    public void requestPasswordReset(String email) {
        User user = userRepository.findByUsername(email);


        if (user == null) {

            user = userRepository.findAll().stream()
                    .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                    .findFirst()
                    .orElse(null);
        }


        if (user == null) {
            return;
        }

        String resetToken = jwtService.generatePasswordResetToken(user.getEmail());
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        emailUtils.sendPasswordResetEmail(user, resetLink);
    }


    public void resetPassword(String token, String newPassword) {

        String email = jwtService.validatePasswordResetToken(token);

        if (email == null) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
        }


        User user = userRepository.findAll().stream()
                .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));


        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedDate(java.time.LocalDateTime.now());
        userRepository.save(user);


        emailUtils.sendPasswordChangedConfirmationEmail(user);
    }
}
