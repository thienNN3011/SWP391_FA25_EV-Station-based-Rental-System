package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.UserUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.CustomerResponse;
import vn.swp391.fa2025.evrental.dto.response.RenterListResponse;
import vn.swp391.fa2025.evrental.dto.response.StaffListResponse;
import vn.swp391.fa2025.evrental.dto.response.UserUpdateResponse;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.mapper.UserMapper;
import vn.swp391.fa2025.evrental.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User findByUsername(String username) {
        User user= new User();
        user= userRepository.findByUsername(username);
        return user;
    }

    @Override
    public List<CustomerResponse> showPendingAccount() {
        List<User> pendingList= userRepository.findByStatusOrderByCreatedDateAsc("PENDING");
        if (pendingList.isEmpty()) {throw new RuntimeException("Khong co tai khoan can duoc duyet");}
        return pendingList.stream().
                map(user -> userMapper.toShortResponse(user)).
                toList();
    }

    @Override
    public CustomerResponse showDetailOfPendingAccount(String username) {
        CustomerResponse customerResponse= new CustomerResponse();
//        User user=userRepository.findByUsernameAndStatus(username,"PENDING");
        User user=userRepository.findByUsername(username);
        if (user==null) throw new RuntimeException("Không tìm thấy tài khoản");
        return userMapper.toDto(user);
    }

    @Override
    public boolean changeAccountStatus(String username, String status) {
        User user= userRepository.findByUsername(username);
        if (user==null) throw new RuntimeException("Không tìm thấy tài khoản cần thay đổi trạng thái");
        status=status.toUpperCase();
        if (!status.equals("PENDING") && !status.equals("ACTIVE") && !status.equals("INACTIVE") && !status.equals("REJECTED")) throw new RuntimeException("Trạng thái tài khoản cần cập nhật không hợp lệ");
        user.setStatus(status);
        return (userRepository.save(user)!=null);
    }

    @Override
    public List<RenterListResponse> showAllRenters(String username) {
        User requestUser = findByUsername(username);
        List<User> rentersList;
        if ("ADMIN".equals(requestUser.getRole())||"STAFF".equals(requestUser.getRole())) {
            rentersList = userRepository.findAll().stream().filter(user -> "RENTER".equals(user.getRole())).toList();
        }else{
            throw new BusinessException("Không có quyền truy cập");
        }
        if (rentersList.isEmpty()) {
            throw new ResourceNotFoundException("Không có Renter nào trong hệ thống");
        }

        return rentersList.stream().map(user -> userMapper.toRenterListResponse(user)).toList();
    }

    @Override
    public List<StaffListResponse> showAllStaffs(String username) {
       User requestUser = findByUsername(username);
       List<User> staffsList;
       if ("ADMIN".equals(requestUser.getRole())) {
           staffsList = userRepository.findAll().stream().filter(user -> "STAFF".equals(user.getRole())).toList();
       }
       else{
           throw new BusinessException("Không có quyền truy cập");
       }
       if(staffsList.isEmpty()){
           throw new ResourceNotFoundException("Không có Staff nào trong hệ thống");
       }
       return staffsList.stream().map(user -> userMapper.toStaffListResponse(user)).toList();
    }

    @Override
    @Transactional
    public UserUpdateResponse updateUser(String currentUsername, UserUpdateRequest request) {
        User user = userRepository.findByUsername(currentUsername);
        if (user == null) {
            throw new BusinessException("Tài khoản không tồn tại trong hệ thống (token không hợp lệ");
        }
        boolean isUpdated = false;


        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            isUpdated = true;
        }


        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            if (!user.getPhone().equals(request.getPhone())) {
                if (userRepository.existsByPhone(request.getPhone())) {
                    throw new BusinessException("Số điện thoại đã tồn tại: " + request.getPhone());
                }
                user.setPhone(request.getPhone());
                isUpdated = true;
            }
        }


        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!user.getEmail().equals(request.getEmail())) {
                if (userRepository.existsByEmail(request.getEmail())) {
                    throw new BusinessException("Email đã tồn tại: " + request.getEmail());
                }
                user.setEmail(request.getEmail());
                isUpdated = true;
            }
        }
        if (!isUpdated) {
            throw new BusinessException("Không có thông tin nào được thay đổi");
        }
        user.setUpdatedDate(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        return userMapper.toUpdateResponse(updatedUser);
    }

    @Override
    @Transactional
    public boolean deleteUser(String username, String currentUsername) {

        if (username.equals(currentUsername)) {
            throw new BusinessException("Bạn không thể xóa tài khoản của chính mình");
        }

        User targetUser = userRepository.findByUsername(username);
        if (targetUser == null) {
            throw new ResourceNotFoundException("Không tìm thấy tài khoản với username: " + username);
        }

        if ("INACTIVE".equals(targetUser.getStatus())) {
            throw new BusinessException("Tài khoản đã ở trạng thái INACTIVE");
        }


        User currentUser = userRepository.findByUsername(currentUsername);
        if (currentUser == null) {
            throw new BusinessException("Không tìm thấy thông tin người dùng hiện tại");
        }

        String currentRole = currentUser.getRole();
        String targetRole = targetUser.getRole();

        if ("STAFF".equals(currentRole)) {

            if (!"RENTER".equals(targetRole)) {
                throw new BusinessException("STAFF chỉ có quyền xóa tài khoản RENTER");
            }
        } else if ("ADMIN".equals(currentRole)) {

        } else {
            throw new BusinessException("Bạn không có quyền xóa tài khoản");
        }


        targetUser.setStatus("INACTIVE");
        targetUser.setUpdatedDate(LocalDateTime.now());
        userRepository.save(targetUser);
        return true;
    }

    @Override
    public CustomerResponse showUserInfo(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("Không tìm thấy thông tin user");
        }
        return userMapper.toDto(user);

    }

}
