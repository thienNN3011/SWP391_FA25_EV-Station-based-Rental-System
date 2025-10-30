package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.request.IncidentReportCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.IncidentReportUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.IncidentReportResponse;

import java.util.List;

public interface IncidentReportService {
    IncidentReportResponse createIncidentReport(IncidentReportCreateRequest request);
    List<IncidentReportResponse> getAllIncidentReports();
    List<IncidentReportResponse> getIncidentReportsByStation(Long stationId);

    IncidentReportResponse updateIncidentReport(Long reportId, IncidentReportUpdateRequest request);
}