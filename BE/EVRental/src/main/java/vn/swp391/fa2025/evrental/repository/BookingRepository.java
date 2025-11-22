package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.dto.response.StationBookingStatsDTO;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.enums.BookingStatus;

import java.math.BigDecimal;
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

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE LOWER(b.user.username) = LOWER(:username)")
    BigDecimal getTotalRevenueByUsername(@Param("username") String username);

    @Query(value = """
    SELECT
        b.bookingId,
        b.status,
        b.actualEndTime,
        b.startTime,
        u.fullName as customerName,
        u.phone as customerPhone,
        u.email as customerEmail,
        b.bankAccount,
        b.bankName,
        p_deposit.amount as originalDeposit,
        CAST(config_refund.value AS INT) as refundRate,
        (p_deposit.amount * CAST(config_refund.value AS INT) / 100) as refundAmount
    FROM bookings b
    INNER JOIN users u ON b.user_id = u.userId
    CROSS APPLY (
        SELECT CAST(value AS INT) AS expire_minutes
        FROM system_config
        WHERE config_key = 'CANCEL_BOOKING_REFUND_EXPIRE'
    ) config_expire
    CROSS APPLY (
        SELECT value
        FROM system_config
        WHERE config_key = 'REFUND'
    ) config_refund
    CROSS APPLY (
        SELECT amount
        FROM payments
        WHERE booking_id = b.bookingId
          AND paymentType = 'DEPOSIT'
    ) p_deposit
    WHERE b.status = 'CANCELLED'
      AND b.actualEndTime IS NOT NULL
      AND b.actualEndTime < DATEADD(MINUTE, -config_expire.expire_minutes, b.startTime)
      AND NOT EXISTS (
          SELECT 1
          FROM payments p_refund
          WHERE p_refund.booking_id = b.bookingId
            AND p_refund.paymentType = 'REFUND_DEPOSIT'
      )
    """, nativeQuery = true)
    List<Object[]> findCancelledWithRefundDetails();

    // Count completed bookings for all stations in a month
    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.status = 'COMPLETED'
          AND b.actualEndTime >= :startDate
          AND b.actualEndTime < :endDate
        """)
    Long countCompletedBookingsByMonth(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Đếm số lượng booking đã hoàn thành của một trạm trong một khoảng thời gian
     *
     * Query này sử dụng JPQL để:
     * 1. Lọc booking có status = 'COMPLETED' (đã hoàn thành)
     * 2. Lọc booking có thời gian kết thúc thực tế (actualEndTime) nằm trong khoảng [startDate, endDate)
     * 3. Lọc booking mà xe thuộc trạm cụ thể (thông qua relationship: Booking → Vehicle → Station)
     *
     * @param startDate Thời điểm bắt đầu của khoảng thời gian (VD: 2025-03-01 00:00:00)
     * @param endDate Thời điểm kết thúc của khoảng thời gian (VD: 2025-04-01 00:00:00)
     * @param stationId ID của trạm cần thống kê
     * @return Số lượng booking đã hoàn thành
     */
    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.status = 'COMPLETED'
          AND b.actualEndTime >= :startDate
          AND b.actualEndTime < :endDate
          AND b.vehicle.station.stationId = :stationId
        """)
    Long countCompletedBookingsByMonthAndStation(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("stationId") Long stationId
    );

    // Get breakdown by station for a month
    @Query("""
        SELECT new vn.swp391.fa2025.evrental.dto.response.StationBookingStatsDTO(
            s.stationId,
            s.stationName,
            COUNT(b.bookingId)
        )
        FROM Booking b
        JOIN b.vehicle v
        JOIN v.station s
        WHERE b.status = 'COMPLETED'
          AND b.actualEndTime >= :startDate
          AND b.actualEndTime < :endDate
        GROUP BY s.stationId, s.stationName
        ORDER BY s.stationName
        """)
    List<StationBookingStatsDTO> getCompletedBookingsBreakdownByStation(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
