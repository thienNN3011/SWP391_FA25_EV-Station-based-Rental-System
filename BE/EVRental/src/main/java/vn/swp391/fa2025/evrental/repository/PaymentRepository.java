package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    Payment findByBooking_BookingIdAndPaymentType(Long bookingId, String paymentType);
    Payment findByReferenceCode(String referenceCode);
}
