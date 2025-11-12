package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
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
}
