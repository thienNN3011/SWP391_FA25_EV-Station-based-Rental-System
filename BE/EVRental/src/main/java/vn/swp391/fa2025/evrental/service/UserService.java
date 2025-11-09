package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.CreateStaffRequest;
import vn.swp391.fa2025.evrental.dto.request.UserRejectedUpdateRequest;
import vn.swp391.fa2025.evrental.dto.request.UserUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.User;

import java.util.List;

@Service
public interface UserService {
    public User findByUsername(String username);
    public List<CustomerResponse> showPendingAccount();
    public CustomerResponse showDetailOfPendingAccount(String username);
    public boolean changeAccountStatus(String username, String status, String reason);
    public List<RenterListResponse> showAllRenters(String username);
    public List<StaffListResponse> showAllStaffs(String username);
    StaffResponse createStaff(String adminUsername, CreateStaffRequest request);
    public UserUpdateResponse updateUser(String currentUsername, UserUpdateRequest request);
    public boolean deleteUser(String username, String currentUsername);
    public CustomerResponse showUserInfo(String username);
    User changeStaffStation(String stationName, Long id);
    ChangeStaffStationResponse listStaffInStation(String stationName);
    User getUserById(Long Id);
    public void updateRejectedUser(UserRejectedUpdateRequest request);
    List<StaffStatsResponse> getStaffStatsByStation(String stationName, Long month, Long year);
    List<StaffResponse> showStaffStation(String stationName);
    List<UserRiskResponse> getUsersAtRisk();
}
