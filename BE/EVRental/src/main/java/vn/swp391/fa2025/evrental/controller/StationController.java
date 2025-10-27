package vn.swp391.fa2025.evrental.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.dto.response.MyStationResponse;
import vn.swp391.fa2025.evrental.service.StationService;

@RestController
public class StationController {

    @Autowired
    private StationService stationService;

    @GetMapping("/showactivestation")
    public ApiResponse<List<StationResponse>> showActivestation() {
        ApiResponse<List<StationResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả trạm thành công");
        response.setData(stationService.showActiveStation());
        response.setCode(200);
        return response;
    }

    @GetMapping("/station/me")
    public ApiResponse<MyStationResponse> getStationInfo() {
        ApiResponse<MyStationResponse> response = new ApiResponse<>();

        // Lấy username từ token hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String staffUsername = auth.getName();

        // Giao cho service; mọi lỗi sẽ để GlobalExceptionHandler xử lý
        MyStationResponse stationResponse = stationService.getCurrentStaffStation(staffUsername);

        response.setSuccess(true);
        response.setMessage("Lấy thông tin trạm thành công");
        response.setData(stationResponse);
        response.setCode(200);
        return response;
    }
}
