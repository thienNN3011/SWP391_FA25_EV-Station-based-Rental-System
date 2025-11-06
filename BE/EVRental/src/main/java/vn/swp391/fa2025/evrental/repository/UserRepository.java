package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.swp391.fa2025.evrental.dto.response.StaffStatsResponse;
import vn.swp391.fa2025.evrental.dto.response.UserRiskResponse;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    @Query("""
    SELECT new vn.swp391.fa2025.evrental.dto.response.StaffStatsResponse(
        u.userId,
        u.fullName,
        COUNT(DISTINCT b.bookingId),
        COALESCE(CAST(SUM(p.amount) AS bigdecimal), CAST(0 AS bigdecimal))
    )
    FROM User u
    LEFT JOIN u.managedContracts c
    LEFT JOIN c.booking b 
        ON b.status = 'COMPLETED'
       AND b.actualEndTime >= :startDate
       AND b.actualEndTime < :endDate
    LEFT JOIN b.payments p 
        ON p.paymentType = 'FINAL_PAYMENT'
    WHERE u.station.stationId = :stationId
      AND u.role = 'STAFF'
    GROUP BY u.userId, u.fullName
    ORDER BY u.fullName
    """)
    List<StaffStatsResponse> getStaffStatsByStationAndMonth(
            @Param("stationId") Long stationId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    @Query("""
    SELECT new vn.swp391.fa2025.evrental.dto.response.UserRiskResponse(
        u.userId,
        u.username,
        u.fullName,
        COUNT(ir.reportId),
        MAX(ir.incidentDate)
    )
    FROM User u
    INNER JOIN u.bookings b
    INNER JOIN b.incidentReports ir
    WHERE u.role = 'RENTER'
    GROUP BY u.userId, u.username, u.fullName
    HAVING COUNT(ir.reportId) > 0
    ORDER BY COUNT(ir.reportId) DESC, MAX(ir.incidentDate) DESC
    """)
    List<UserRiskResponse> getUsersWithIncidents();
}

