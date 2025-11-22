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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@Tag(name = "Incident Report Management", description = "Quản lý báo cáo sự cố")
@RestController
@RequestMapping("/incidentreport")
public class IncidentReportController {

    @Autowired
    private IncidentReportService incidentReportService;

    @Operation(summary = "Tạo báo cáo sự cố", description = "Staff tạo báo cáo sự cố cho booking")
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

    @Operation(summary = "Xem tất cả báo cáo sự cố", description = "Lấy danh sách tất cả báo cáo")
    @GetMapping("/showall")
    public ApiResponse<List<IncidentReportResponse>> getAllIncidentReports() {
        ApiResponse<List<IncidentReportResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy danh sách báo cáo sự cố thành công");
        response.setData(incidentReportService.getAllIncidentReports());
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem báo cáo theo trạm", description = "Lấy các báo cáo sự cố của một trạm")
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

    @Operation(summary = "Cập nhật báo cáo sự cố", description = "Staff cập nhật thông tin báo cáo")
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