package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.enums.StationStatus;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    List<Station> findByStatus(StationStatus status);
    Station findByStationName(String stationName);
    @Query("""
    SELECT DISTINCT s
    FROM Station s
    JOIN s.vehicles v
    WHERE s.status = vn.swp391.fa2025.evrental.enums.StationStatus.OPEN
      AND v.status = vn.swp391.fa2025.evrental.enums.VehicleStatus.AVAILABLE
""")
    List<Station> findOpenStationsWithAvailableVehicles();

}
