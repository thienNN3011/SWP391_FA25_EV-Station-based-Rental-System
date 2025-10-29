package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.IncidentReportCreateRequest;
import vn.swp391.fa2025.evrental.dto.response.IncidentReportResponse;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.IncidentReport;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.mapper.IncidentReportMapper;
import vn.swp391.fa2025.evrental.repository.BookingRepository;
import vn.swp391.fa2025.evrental.repository.IncidentReportRepository;
import vn.swp391.fa2025.evrental.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidentReportServiceImpl implements IncidentReportService {

    @Autowired
    private IncidentReportRepository incidentReportRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncidentReportMapper incidentReportMapper;

    @Override
    @Transactional
    public IncidentReportResponse createIncidentReport(IncidentReportCreateRequest request) {
        // 1. Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User không tồn tại");
        }

        // 2. Validate booking exists
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        // 3. Validate booking status is COMPLETED
        if (!booking.getStatus().equalsIgnoreCase("COMPLETED")) {
            throw new RuntimeException("Chỉ có thể tạo báo cáo sự cố cho booking đã hoàn thành (COMPLETED)");
        }

        // 4. Validate staff belongs to same station as vehicle (for STAFF role)
        if (user.getRole().equalsIgnoreCase("STAFF")) {
            if (user.getStation() == null) {
                throw new RuntimeException("Staff chưa được gán trạm");
            }
            if (!user.getStation().getStationId().equals(booking.getVehicle().getStation().getStationId())) {
                throw new RuntimeException(
                        "Bạn chỉ có thể tạo báo cáo sự cố cho booking thuộc trạm của bạn. " +
                                "Station của bạn: " + user.getStation().getStationId() +
                                ", Station của booking: " + booking.getVehicle().getStation().getStationId()
                );
            }
        }

        // 5. Validate afterRentingStatus exists and not empty
        if (booking.getAfterRentingStatus() == null || booking.getAfterRentingStatus().trim().isEmpty()) {
            throw new RuntimeException("Booking không có thông tin tình trạng xe sau thuê");
        }

        // 6. Check if incident report already exists for this booking
        List<IncidentReport> existingReports = incidentReportRepository.findByBooking_BookingId(booking.getBookingId());
        if (!existingReports.isEmpty()) {
            throw new RuntimeException("Booking này đã có báo cáo sự cố. Không thể tạo báo cáo trùng lặp");
        }

        // 7. Create incident report
        IncidentReport incidentReport = IncidentReport.builder()
                .booking(booking)
                .description(booking.getAfterRentingStatus())
                .incidentDate(LocalDateTime.now())
                .status("PENDING")
                .cost(BigDecimal.ZERO)
                .build();

        // 8. Save incident report
        IncidentReport savedReport = incidentReportRepository.save(incidentReport);

        // 9. Map to response and return
        return incidentReportMapper.toIncidentReportResponse(savedReport);
    }
}