package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.swp391.fa2025.evrental.dto.request.IncidentReportCreateRequest;
import vn.swp391.fa2025.evrental.dto.response.IncidentReportResponse;
import vn.swp391.fa2025.evrental.service.IncidentReportService;

@RestController
@RequestMapping("/incidentreport")
public class IncidentReportController {

    @Autowired
    private IncidentReportService incidentReportService;

    @PostMapping("/create")
    public ResponseEntity<IncidentReportResponse> createIncidentReport(
            @Valid @RequestBody IncidentReportCreateRequest request) {
        IncidentReportResponse response = incidentReportService.createIncidentReport(request);
        return ResponseEntity.ok(response);
    }


}