package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.enums.StationStatus;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    List<Station> findByStatus(StationStatus status);
    Station findByStationName(String stationName);
}
