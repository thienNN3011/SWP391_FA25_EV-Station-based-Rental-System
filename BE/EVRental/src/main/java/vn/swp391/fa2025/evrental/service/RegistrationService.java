package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vn.swp391.fa2025.evrental.dto.request.RegisterCustomerRequest;
import vn.swp391.fa2025.evrental.dto.response.CustomerResponse;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.mapper.UserMapper;
import vn.swp391.fa2025.evrental.repository.UserRepository;

import java.time.LocalDateTime;

@Service
public class RegistrationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public CustomerResponse registerCustomer(RegisterCustomerRequest req) {
        // Validate duplicates (409 Conflict)
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        if (userRepository.existsByIdCard(req.getIdCard())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "ID card already exists");
        }
        if (userRepository.existsByDriveLicense(req.getDriveLicense())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Driver license already exists");
        }

        // Store images
       String idCardPath = req.getIdCardPhoto();
        String driveLicensePath = req.getDriveLicensePhoto();


        // Map request -> entity via MapStruct
        User user = userMapper.toEntity(req, idCardPath, driveLicensePath);
        user.setRole("RENTER");
        user.setStatus("PENDING");
        user.setCreatedDate(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user = userRepository.save(user);

        // Map entity -> response DTO via MapStruct
        return userMapper.toDto(user);
    }
}

