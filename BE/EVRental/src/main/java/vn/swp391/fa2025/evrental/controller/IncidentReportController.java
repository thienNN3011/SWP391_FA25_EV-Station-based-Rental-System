package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.IncidentReportCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.IncidentReportUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.IncidentReportResponse;
import vn.swp391.fa2025.evrental.service.IncidentReportService;

import java.util.List;

@RestController
@RequestMapping("/incidentreport")
public class IncidentReportController {

    @Autowired
    private IncidentReportService incidentReportService;

    @PostMapping("/create")
    public ApiResponse<IncidentReportResponse> createIncidentReport(
            @Valid @RequestBody IncidentReportCreateRequest request) {
        ApiResponse<IncidentReportResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo báo cáo sự cố thành công");
        response.setData(incidentReportService.createIncidentReport(request));
        response.setCode(201);
        return response;
    }

    @GetMapping("/showall")
    public ApiResponse<List<IncidentReportResponse>> getAllIncidentReports() {
        ApiResponse<List<IncidentReportResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy danh sách báo cáo sự cố thành công");
        response.setData(incidentReportService.getAllIncidentReports());
        response.setCode(200);
        return response;
    }

    @GetMapping("/showbystation/{stationId}")
    public ApiResponse<List<IncidentReportResponse>> getIncidentReportsByStation(
            @PathVariable Long stationId) {
        ApiResponse<List<IncidentReportResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy danh sách báo cáo sự cố theo trạm thành công");
        response.setData(incidentReportService.getIncidentReportsByStation(stationId));
        response.setCode(200);
        return response;
    }

    @PutMapping("/update")
    public ApiResponse<IncidentReportResponse> updateIncidentReport(
            @Valid @RequestBody IncidentReportUpdateRequest request) {
        ApiResponse<IncidentReportResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật báo cáo sự cố thành công");
        response.setData(incidentReportService.updateIncidentReport(request.getReportId(), request));
        response.setCode(200);
        return response;
    }
}