package vn.swp391.fa2025.evrental.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.StationCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.StationUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.service.StationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@Tag(name = "Station Management", description = "Quản lý trạm")
@RestController
public class StationController {

    @Autowired
    private StationService stationService;

    @Operation(summary = "Xem trạm đang hoạt động", description = "Lấy danh sách các trạm active")
    @GetMapping("/showactivestation")
    public ApiResponse<List<StationResponse>> showActivestation() {
        ApiResponse<List<StationResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả trạm thành công");
        response.setData(stationService.showActiveStation());
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem trạm của staff", description = "Staff xem thông tin trạm mình đang quản lý")
    @GetMapping("/station/me")
    public ApiResponse<MyStationResponse> getStationInfo() {
        ApiResponse<MyStationResponse> response = new ApiResponse<>();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String staffUsername = auth.getName();

        MyStationResponse stationResponse = stationService.getCurrentStaffStation(staffUsername);

        response.setSuccess(true);
        response.setMessage("Lấy thông tin trạm thành công");
        response.setData(stationResponse);
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem tất cả trạm", description = "Lấy danh sách tất cả trạm")
    @GetMapping("/station/showall")
    public ApiResponse<List<StationShowAllResponse>> showAllStations() {
        ApiResponse<List<StationShowAllResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả trạm thành công");
        response.setData(stationService.showAllStation());
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Tạo trạm mới", description = "Admin tạo trạm cho thuê xe")
    @PostMapping("/station/create")
    public ApiResponse<StationResponse> createStation(@Valid @RequestBody StationCreateRequest request) {
        ApiResponse<StationResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo trạm thành công");
        response.setData(stationService.createStation(request));
        response.setCode(201);
        return response;
    }

    @Operation(summary = "Cập nhật trạm", description = "Admin cập nhật thông tin trạm")
    @PutMapping("/station/update/{stationId}")
    public ApiResponse<StationUpdateResponse> updateStation(
            @PathVariable Long stationId,
            @Valid @RequestBody StationUpdateRequest request) {
        ApiResponse<StationUpdateResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật trạm thành công");
        response.setData(stationService.updateStation(stationId, request));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xóa trạm", description = "Admin xóa trạm khỏi hệ thống")
    @DeleteMapping("/station/delete/{stationId}")
    public ApiResponse<Void> deleteStation(@PathVariable Long stationId) {
        ApiResponse<Void> response = new ApiResponse<>();
        stationService.deleteStation(stationId);
        response.setSuccess(true);
        response.setMessage("Xóa trạm thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Thống kê xe theo trạm", description = "Xem số lượng xe theo trạng thái tại trạm")
    @GetMapping("/station/vehiclestats/{stationId}")
    public ApiResponse<StationVehicleStatsResponse> getStationVehicleStats(@PathVariable Long stationId) {
        ApiResponse<StationVehicleStatsResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thống kê xe của trạm thành công");
        response.setData(stationService.getStationVehicleStats(stationId));
        response.setCode(200);
        return response;
    }

}
