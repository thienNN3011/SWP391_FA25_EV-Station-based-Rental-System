package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Payment;
import vn.swp391.fa2025.evrental.enums.PaymentMethod;
import vn.swp391.fa2025.evrental.enums.PaymentType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    Payment findByBooking_BookingIdAndPaymentType(Long bookingId, PaymentType paymentType);
    Payment findByReferenceCode(String referenceCode);
    List<Payment> findAllByTransactionDateBetween(LocalDateTime start, LocalDateTime end);
    List<Payment> findAllByBooking_BookingIdIn(Set<Long> bookingIds);
    Payment findByMethodAndReferenceCode(PaymentMethod method, String referenceCode);
    List<Payment> findAllByBooking_BookingIdInOrderByTransactionDateDesc(Set<Long> bookingIds);

    // Get payment history for a specific booking
    List<Payment> findByBooking_BookingIdOrderByTransactionDateDesc(Long bookingId);

    @Query("SELECT p FROM Payment p " +
            "JOIN p.booking b " +
            "JOIN b.vehicle v " +
            "JOIN v.station s " +
            "WHERE (:startDate IS NULL OR p.transactionDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.transactionDate <= :endDate) " +
            "AND (:stationId IS NULL OR s.stationId = :stationId) " +
            "AND (:paymentType IS NULL OR p.paymentType = :paymentType) " +
            "ORDER BY p.transactionDate DESC")
    Page<Payment> searchTransactions(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate,
                                     @Param("stationId") Long stationId,
                                     @Param("paymentType") PaymentType paymentType,
                                     Pageable pageable);
}
