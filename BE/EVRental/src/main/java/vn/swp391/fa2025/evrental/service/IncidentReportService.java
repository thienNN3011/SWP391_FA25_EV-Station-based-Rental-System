package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.request.IncidentReportCreateRequest;
import vn.swp391.fa2025.evrental.dto.response.IncidentReportResponse;

public interface IncidentReportService {
    IncidentReportResponse createIncidentReport(IncidentReportCreateRequest request);
}