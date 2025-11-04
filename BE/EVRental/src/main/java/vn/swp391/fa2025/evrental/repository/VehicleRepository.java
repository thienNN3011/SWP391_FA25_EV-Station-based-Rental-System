package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Vehicle;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByModel_ModelId(Long modelId);

    List<Vehicle> findByStation_StationIdAndModel_ModelIdAndColor(Long stationId, Long modelId, String color);

    Vehicle findFirstByModel_ModelIdAndStation_StationName(Long modelId, String stationName);

    Optional<Vehicle> findByPlateNumber(String plateNumber);

    // Lấy danh sách xe theo stationId
    List<Vehicle> findByStation_StationId(Long stationId);

    List<Vehicle> findByStation_StationIdAndStatus(Long stationId, String status);
    List<Vehicle> findByStation_StationNameAndStatus(String stationName, String status);
    List<Vehicle> findByStation_StationNameAndModel_ModelIdAndStatus(String stationName, Long modelId, String status);
}
