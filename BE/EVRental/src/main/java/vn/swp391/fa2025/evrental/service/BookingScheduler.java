package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Payment;
import vn.swp391.fa2025.evrental.repository.BookingRepository;
import vn.swp391.fa2025.evrental.repository.PaymentRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class BookingScheduler {
    @Autowired
    private BookingServiceImpl bookingService;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @Scheduled(fixedRate = 15 * 60 * 1000)
    public void cancelBooking() {
        List<Booking> bookings = bookingRepository.findByStatus("UNCONFIRMED");
        if (bookings.isEmpty()) {
            return;
        }
        for (Booking booking : bookings) {
            Payment payment = paymentRepository.findByBooking_BookingIdAndPaymentType(
                    booking.getBookingId(), "DEPOSIT");
            if (payment == null) {
                LocalDateTime createdTime = booking.getCreatedDate();
                LocalDateTime now = LocalDateTime.now();
                long minutesElapsed = Duration.between(createdTime, now).toMinutes();
                if (minutesElapsed >= 15) {
                    bookingService.cancelBooking(booking.getBookingId());
                    System.out.println("⏰ Booking #" + booking.getBookingId() + " bị hủy do quá hạn thanh toán.");
                }
            }
        }
    }
}
