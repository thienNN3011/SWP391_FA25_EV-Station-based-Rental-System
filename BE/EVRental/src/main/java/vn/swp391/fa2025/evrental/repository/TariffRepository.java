package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Tariff;

import java.util.List;

@Repository
public interface TariffRepository extends JpaRepository<Tariff,Long> {
    public Tariff findByTariffIdAndModel_ModelId(Long tariffId, Long modelId);
    public List<Tariff> findByModel_ModelId(Long modelId);
    public boolean existsByModel_ModelIdAndType(Long modelId, String type);
    public List<Tariff> findByStatus(String status);
}
