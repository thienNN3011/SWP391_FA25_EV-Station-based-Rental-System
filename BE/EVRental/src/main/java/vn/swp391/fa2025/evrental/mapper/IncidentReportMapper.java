package vn.swp391.fa2025.evrental.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import vn.swp391.fa2025.evrental.dto.response.IncidentReportResponse;
import vn.swp391.fa2025.evrental.entity.IncidentReport;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface IncidentReportMapper {

    @Mapping(target = "bookingId", source = "booking.bookingId")
    IncidentReportResponse toIncidentReportResponse(IncidentReport incidentReport);
}