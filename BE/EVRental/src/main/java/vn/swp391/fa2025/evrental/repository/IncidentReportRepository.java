package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.swp391.fa2025.evrental.entity.IncidentReport;

import java.util.List;

public interface IncidentReportRepository extends JpaRepository<IncidentReport,Long> {
    List<IncidentReport> findByBooking_BookingId(Long bookingId);

}
