package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.entity.Payment;

@Service
public interface PaymentService {
    public void createPayment(Payment payment);
    Payment getPaymentByBookingIdAndType(Long bookingId, String paymentType);
}
