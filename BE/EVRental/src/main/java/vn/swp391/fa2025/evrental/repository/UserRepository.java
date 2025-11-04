package vn.swp391.fa2025.evrental.repository;

import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByIdCard(String idCard);
    boolean existsByDriveLicense(String driveLicense);
    List<User> findFirstByStatusOrderByCreatedDateAsc(String status);
    User findByUsernameAndStatus(String username, String status);
    List<User> findByStatusOrderByCreatedDateAsc(String status);
    List<User> findByStation(Station station);
}
