package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Tariff;
@Repository
public interface TariffRepository extends JpaRepository<Tariff,Long> {

}
