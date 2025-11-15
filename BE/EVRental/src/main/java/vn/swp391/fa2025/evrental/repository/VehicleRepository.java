package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.enums.VehicleStatus;

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

    List<Vehicle> findByStation_StationIdAndStatus(Long stationId, VehicleStatus status);
    List<Vehicle> findByStation_StationNameAndStatus(String stationName, VehicleStatus status);
    List<Vehicle> findByStation_StationNameAndModel_ModelIdAndStatus(String stationName, Long modelId, VehicleStatus status);

    @Query(value = """
    SELECT TOP 1 * FROM vehicles WITH (UPDLOCK, READPAST)
    WHERE station_id = :stationId
    AND model_id = :modelId
    AND color = :color
    AND status = 'AVAILABLE'
    """, nativeQuery = true)
    Optional<Vehicle> findOneAvailableVehicleForUpdate(
            @Param("stationId") Long stationId,
            @Param("modelId") Long modelId,
            @Param("color") String color
    );

    @Query(value = """
    SELECT * FROM vehicles WITH (READPAST)
    WHERE station_id = :stationId
    AND model_id = :modelId
    AND status = 'AVAILABLE'
    """, nativeQuery = true)
    List<Vehicle> findAvailableVehiclesWithoutLock(
            @Param("stationId") Long stationId,
            @Param("modelId") Long modelId
    );
}
