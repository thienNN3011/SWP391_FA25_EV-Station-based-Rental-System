package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.SystemConfig;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig,Long> {
    SystemConfig findByKey(String key);
}
