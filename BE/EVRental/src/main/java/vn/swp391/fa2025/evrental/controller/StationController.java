package vn.swp391.fa2025.evrental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.service.StationService;
import vn.swp391.fa2025.evrental.service.StationServiceImpl;

import java.util.List;

@RestController
public class StationController {
    @Autowired
    private StationServiceImpl stationService;

    @GetMapping("/showactivestation")
    public ApiResponse<List<StationResponse>> showActivestation(){
        ApiResponse<List<StationResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả trạm thành công");
        response.setData(stationService.showActiveStation());
        response.setCode(200);
        return response;
    }
}
