package vn.swp391.fa2025.evrental.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.response.UserStatsResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleStatsResponse;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.enums.BookingStatus;
import vn.swp391.fa2025.evrental.repository.BookingRepository;

/**
 * Service xử lý thống kê hoạt động của user
 * Tính tổng booking, km, thời gian và top 10 xe được thuê nhiều nhất
 */
@Service
public class UserStatsServiceImpl implements UserStatsService {

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * Lấy thống kê hoạt động của user: tổng booking, km, thời gian, top 10 xe
     */
    @Override
    @Transactional(readOnly = true)
    public UserStatsResponse getCurrentUserStats(String username) {
        // Query tất cả booking COMPLETED của user
        List<Booking> bookings = bookingRepository.findByStatusAndUser_Username(
            BookingStatus.fromString("COMPLETED"),
            username
        );

        long totalCompleted = bookings.size();
        double totalDistanceKm = 0.0;
        long totalDurationMinutes = 0;

        // Map để gom nhóm thống kê theo xe (key: vehicleId)
        Map<Long, VehicleAccumulator> vehicleMap = new LinkedHashMap<>();

        // Duyệt qua từng booking để tính tổng và gom nhóm theo xe
        for (Booking booking : bookings) {
            double distance = calculateDistanceKm(booking);
            long duration = calculateDurationMinutes(booking);

            totalDistanceKm += distance;
            totalDurationMinutes += duration;

            Vehicle vehicle = booking.getVehicle();
            if (vehicle == null) continue;

            Long vehicleId = vehicle.getVehicleId();
            VehicleAccumulator accumulator = vehicleMap.computeIfAbsent(
                vehicleId,
                id -> new VehicleAccumulator(vehicle)
            );
            accumulator.addBooking(distance);
        }

        // Convert Map sang List để sắp xếp
        List<VehicleStatsResponse> vehicleStats = new ArrayList<>();
        for (VehicleAccumulator accumulator : vehicleMap.values()) {
            vehicleStats.add(accumulator.toResponse());
        }

        // Sắp xếp theo số lần thuê giảm dần, sau đó theo biển số xe
        vehicleStats.sort(Comparator
                .comparingLong(VehicleStatsResponse::getBookingsCount)
                .reversed()
                .thenComparing(VehicleStatsResponse::getPlateNumber,
                    Comparator.nullsLast(String::compareToIgnoreCase))
        );

        // Lấy top 10 xe
        if (vehicleStats.size() > 10) {
            vehicleStats = vehicleStats.subList(0, 10);
        }

        return UserStatsResponse.builder()
                .totalBookingCompleted(totalCompleted)
                .totalDistanceKm(roundToOneDecimal(totalDistanceKm))
                .totalDurationMinutes(totalDurationMinutes)
                .vehicles(vehicleStats)
                .build();
    }

    // Tính quãng đường: endOdo - startOdo (km)
    private double calculateDistanceKm(Booking booking) {
        Long start = booking.getStartOdo();
        Long end = booking.getEndOdo();
        if (start == null || end == null || end < start) {
            return 0.0;
        }
        return end - start;
    }

    // Tính thời gian thuê: ưu tiên actualTime, fallback về plannedTime (phút)
    private long calculateDurationMinutes(Booking booking) {
        LocalDateTime start = booking.getActualStartTime();
        LocalDateTime end = booking.getActualEndTime();

        if (start == null || end == null) {
            start = booking.getStartTime();
            end = booking.getEndTime();
        }

        if (start == null || end == null || end.isBefore(start)) {
            return 0;
        }

        return ChronoUnit.MINUTES.between(start, end);
    }

    // Làm tròn 1 chữ số thập phân
    private double roundToOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    /**
     * Inner class để tích lũy thống kê của từng xe
     * Gom nhóm booking theo xe, tính tổng số lần thuê và quãng đường
     */
    private static class VehicleAccumulator {
        private final String plateNumber;
        private final String stationName;
        private final String modelName;
        private final String brand;
        private long bookingsCount;
        private double distanceKm;

        VehicleAccumulator(Vehicle vehicle) {
            this.plateNumber = vehicle.getPlateNumber();
            this.stationName = vehicle.getStation() != null ? vehicle.getStation().getStationName() : null;
            this.modelName = vehicle.getModel() != null ? vehicle.getModel().getName() : null;
            this.brand = vehicle.getModel() != null ? vehicle.getModel().getBrand() : null;
        }

        // Cộng dồn số lần thuê và quãng đường
        void addBooking(double distance) {
            bookingsCount += 1;
            distanceKm += distance;
        }

        // Convert sang DTO để trả về client
        VehicleStatsResponse toResponse() {
            return VehicleStatsResponse.builder()
                    .plateNumber(plateNumber)
                    .stationName(stationName)
                    .modelName(modelName)
                    .brand(brand)
                    .bookingsCount(bookingsCount)
                    .distanceKm(roundToOneDecimal(distanceKm))
                    .build();
        }

        private double roundToOneDecimal(double value) {
            return Math.round(value * 10.0) / 10.0;
        }
    }
}
