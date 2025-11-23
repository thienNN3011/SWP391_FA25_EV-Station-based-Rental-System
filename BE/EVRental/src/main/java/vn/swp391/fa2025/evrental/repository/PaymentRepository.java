package vn.swp391.fa2025.evrental.repository;

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
}
