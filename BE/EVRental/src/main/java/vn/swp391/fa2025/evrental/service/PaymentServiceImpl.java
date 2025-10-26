package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.entity.Payment;
import vn.swp391.fa2025.evrental.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public void createPayment(Payment payment) {
        paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentByBookingIdAndType(Long bookingId, String paymentType) {
        return paymentRepository.findByBooking_BookingIdAndPaymentType(bookingId, paymentType);
    }
}
