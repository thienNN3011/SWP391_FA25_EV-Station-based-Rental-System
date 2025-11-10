package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Payment;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.enums.BookingStatus;
import vn.swp391.fa2025.evrental.enums.PaymentType;
import vn.swp391.fa2025.evrental.enums.VehicleStatus;
import vn.swp391.fa2025.evrental.repository.BookingRepository;
import vn.swp391.fa2025.evrental.repository.PaymentRepository;
import vn.swp391.fa2025.evrental.repository.VehicleRepository;

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
    @Autowired
    private SystemConfigServiceImpl systemConfigService;
    @Autowired
    private VehicleRepository vehicleRepository;

    @Scheduled(fixedRate = 4 * 60 * 1000)
    @Transactional
    public void cancelBooking() {
        List<Booking> bookings = bookingRepository.findByStatus(BookingStatus.fromString("UNCONFIRMED"));
        if (bookings.isEmpty()) {
            return;
        }
        for (Booking booking : bookings) {
            Payment payment = paymentRepository.findByBooking_BookingIdAndPaymentType(
                    booking.getBookingId(), PaymentType.fromString("DEPOSIT"));
            if (payment == null) {
                LocalDateTime createdTime = booking.getCreatedDate();
                LocalDateTime now = LocalDateTime.now();
                long minutesElapsed = Duration.between(createdTime, now).toMinutes();
                if (minutesElapsed >= Integer.parseInt(systemConfigService.getSystemConfigByKey("QR_EXPIRE").getValue())) {
                    bookingService.cancelBookingForSystem(booking.getBookingId());
                    System.out.println("⏰ Booking #" + booking.getBookingId() + " bị hủy do quá hạn thanh toán.");
                }
            }
        }
    }

    @Scheduled(fixedRate =  5 * 60 * 1000)
    @Transactional
    public void checkLateBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> bookings = bookingRepository.findByStatus(BookingStatus.fromString("BOOKING"));

        int minute=Integer.parseInt(systemConfigService.getSystemConfigByKey("CHECK_IN_EXPIRE").getValue());
        for (Booking b : bookings) {
            if (now.isAfter(b.getStartTime().plusMinutes(minute))) {

                b.setStatus(BookingStatus.fromString("NO_SHOW"));
                bookingRepository.save(b);

                Vehicle vehicle=b.getVehicle();
                vehicle.setStatus(VehicleStatus.fromString("AVAILABLE"));
                vehicleRepository.save(vehicle);
                System.out.println("Booking " + b.getBookingId() + " đi trễ 30p so với thời gian nhận");
            }
        }
    }
}
