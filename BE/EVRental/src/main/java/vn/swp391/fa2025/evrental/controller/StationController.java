package vn.swp391.fa2025.evrental.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.StationCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.StationUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.dto.response.MyStationResponse;
import vn.swp391.fa2025.evrental.dto.response.StationUpdateResponse;
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

<<<<<<< HEAD
    @PostMapping("/station/create")
    public ApiResponse<StationResponse> createStation(@Valid @RequestBody StationCreateRequest request) {
        ApiResponse<StationResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo trạm thành công");
=======
    @GetMapping("/showbyid/{id}")
    public ApiResponse<StationResponse> getStationById(@PathVariable Long id) {
        ApiResponse<StationResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin trạm thành công");
        response.setData(stationService.getStationById(id));
        response.setCode(200);
        return response;
    }

    @PostMapping("/create")
    public ApiResponse<StationResponse> createStation(
            @Valid @RequestBody StationCreateRequest request) {
        ApiResponse<StationResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo trạm mới thành công");
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setData(stationService.createStation(request));
        response.setCode(201);
        return response;
    }

<<<<<<< HEAD
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
    @DeleteMapping("/station/delete/{stationId}")
    public ApiResponse<Void> deleteStation(@PathVariable Long stationId) {
        ApiResponse<Void> response = new ApiResponse<>();
        stationService.deleteStation(stationId);
=======
    @PutMapping("/update/{id}")
    public ApiResponse<StationResponse> updateStation(
            @PathVariable Long id,
            @Valid @RequestBody StationUpdateRequest request) {
        ApiResponse<StationResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật thông tin trạm thành công");
        response.setData(stationService.updateStation(id, request));
        response.setCode(200);
        return response;
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteStation(@PathVariable Long id) {
        ApiResponse<Void> response = new ApiResponse<>();
        stationService.deleteStation(id);
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setSuccess(true);
        response.setMessage("Xóa trạm thành công");
        response.setCode(200);
        return response;
    }
}
