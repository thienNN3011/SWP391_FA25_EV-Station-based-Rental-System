package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.IncidentReportCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.IncidentReportUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.IncidentReportResponse;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.IncidentReport;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.enums.IncidentReportStatus;
import vn.swp391.fa2025.evrental.mapper.IncidentReportMapper;
import vn.swp391.fa2025.evrental.repository.BookingRepository;
import vn.swp391.fa2025.evrental.repository.IncidentReportRepository;
import vn.swp391.fa2025.evrental.repository.StationRepository;
import vn.swp391.fa2025.evrental.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    @Autowired
    private StationRepository stationRepository;

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
        if (!booking.getStatus().toString().equalsIgnoreCase("COMPLETED")) {
            throw new RuntimeException("Chỉ có thể tạo báo cáo sự cố cho booking đã hoàn thành (COMPLETED)");
        }

        // 4. Validate staff belongs to same station as vehicle (for STAFF role)
        if (user.getRole().toString().equalsIgnoreCase("STAFF")) {
            if (user.getStation() == null) {
                throw new RuntimeException("Staff chưa được gán trạm");
            }
            if (!user.getStation().getStationId().equals(booking.getVehicle().getStation().getStationId())) {
                throw new RuntimeException(
                        "Bạn chỉ có thể tạo báo cáo sự cố cho booking thuộc trạm của bạn. " );
            }
        }

        // 5. Check if incident report already exists for this booking
        List<IncidentReport> existingReports = incidentReportRepository.findByBooking_BookingId(booking.getBookingId());
        if (!existingReports.isEmpty()) {
            throw new RuntimeException("Booking này đã có báo cáo sự cố. Không thể tạo báo cáo trùng lặp");
        }

        // 6. Create incident report
        IncidentReport incidentReport = IncidentReport.builder()
                .booking(booking)
                .description(request.getDescription())
                .incidentImageUrl(request.getIncidentImageUrl())
                .incidentDate(LocalDateTime.now())
                .status(IncidentReportStatus.fromString("PENDING"))
                .build();

        // 7. Save incident report
        IncidentReport savedReport = incidentReportRepository.save(incidentReport);

        // 8. Map to response and return
        return incidentReportMapper.toIncidentReportResponse(savedReport);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentReportResponse> getAllIncidentReports() {
        List<IncidentReport> reports = incidentReportRepository.findAll();

        return reports.stream()
                .map(incidentReportMapper::toIncidentReportResponse)
                .collect(   Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentReportResponse> getIncidentReportsByStation(Long stationId) {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User không tồn tại");
        }
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Trạm không tồn tại"));

        // If STAFF, validate they can only view reports from their station
        if (user.getRole().toString().equalsIgnoreCase("STAFF")) {
            if (user.getStation() == null) {
                throw new RuntimeException("Staff chưa được gán trạm");
            }
            if (!user.getStation().getStationId().equals(stationId)) {
                throw new RuntimeException("Bạn chỉ có thể xem báo cáo sự cố của trạm mình");
            }
        }

        // Get all reports and filter by station
        List<IncidentReport> allReports = incidentReportRepository.findAll();

        List<IncidentReport> stationReports = allReports.stream()
                .filter(report -> report.getBooking() != null
                        && report.getBooking().getVehicle() != null
                        && report.getBooking().getVehicle().getStation() != null
                        && report.getBooking().getVehicle().getStation().getStationId().equals(stationId))
                .collect(Collectors.toList());

        return stationReports.stream()
                .map(incidentReportMapper::toIncidentReportResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public IncidentReportResponse updateIncidentReport(Long reportId, IncidentReportUpdateRequest request) {
        // Validate report exists
        IncidentReport report = incidentReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Báo cáo sự cố không tồn tại"));

        //  Validate status
        String newStatus = request.getStatus().toUpperCase();
        if (!newStatus.equals("PENDING") && !newStatus.equals("RESOLVED") && !newStatus.equals("REJECTED")) {
            throw new RuntimeException("Status không hợp lệ. Chỉ chấp nhận: PENDING, RESOLVED, REJECTED");
        }

        // Update report
        report.setStatus(IncidentReportStatus.fromString(newStatus));

        // Save and return
        IncidentReport updatedReport = incidentReportRepository.save(report);
        return incidentReportMapper.toIncidentReportResponse(updatedReport);
    }
}