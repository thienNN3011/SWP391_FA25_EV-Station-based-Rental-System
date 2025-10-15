package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.CustomerResponse;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.mapper.UserMapper;
import vn.swp391.fa2025.evrental.repository.UserRepository;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;


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


}
