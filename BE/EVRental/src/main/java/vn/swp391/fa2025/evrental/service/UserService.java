package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.entity.User;

@Service
public interface UserService {
    public User findByUsername(String username);
}
