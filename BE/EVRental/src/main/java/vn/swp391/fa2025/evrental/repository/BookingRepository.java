package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.enums.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStatusAndStartTimeAfterOrderByStartTimeAsc(BookingStatus status, LocalDateTime currentTime);
    List<Booking> findByStatusAndStartTimeAfterAndVehicle_Station_StationIdOrderByStartTimeAsc(
            BookingStatus status,
            LocalDateTime currentTime,
            Long stationId
    );
    List<Booking> findByStatusAndUser_Username(BookingStatus status, String username);
    List<Booking> findByStatusAndVehicle_Station_StationId(BookingStatus status, Long stationId);
    List<Booking> findByVehicle_Station_StationId(Long stationId);
    List<Booking> findByUser_Username(String username);
    List<Booking> findByStatus(BookingStatus status);
}
