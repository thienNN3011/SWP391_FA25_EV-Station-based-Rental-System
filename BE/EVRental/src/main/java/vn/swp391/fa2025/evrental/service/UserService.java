package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.UpdateUserRequest;
import vn.swp391.fa2025.evrental.dto.response.CustomerResponse;
import vn.swp391.fa2025.evrental.dto.response.UpdateUserResponse;
import vn.swp391.fa2025.evrental.dto.response.UserListResponse;
import vn.swp391.fa2025.evrental.entity.User;

import java.util.List;

@Service
public interface UserService {
    public User findByUsername(String username);
    public List<CustomerResponse> showPendingAccount();
    public CustomerResponse showDetailOfPendingAccount(String username);
    public boolean changeAccountStatus(String username, String status);
    public List<UserListResponse> showAllUsers(String username);
    public UpdateUserResponse updateUser(String currentUsername, UpdateUserRequest request);
    public boolean deleteUser(String username, String currentUsername);
}
