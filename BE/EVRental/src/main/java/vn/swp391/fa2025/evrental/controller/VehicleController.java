package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.*;
import vn.swp391.fa2025.evrental.dto.response.ActiveVehicleResponse;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.service.VehicleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

@Tag(name = "Vehicle Management", description = "Quản lý xe")
@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @Operation(summary = "Xem tất cả xe")
    @GetMapping("/showall")
    public ApiResponse<List<VehicleResponse>> showAllVehicle() {
        ApiResponse<List<VehicleResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả xe thành công");
        response.setData(vehicleService.showAllVehicle());
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem xe theo ID", description = "Lấy thông tin chi tiết một xe")
    @GetMapping("/showbyid/{id}")
    public ApiResponse<VehicleResponse> getVehicleById(@PathVariable Long id) {
        ApiResponse<VehicleResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin xe thành công");
        response.setData(vehicleService.getVehicleById(id));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Tạo xe mới", description = "Admin/Staff thêm xe vào hệ thống")
    @PostMapping("/create")
    public ApiResponse<VehicleResponse> createVehicle(
            @Valid @RequestBody VehicleCreateRequest request) {
        ApiResponse<VehicleResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo xe mới thành công");
        response.setData(vehicleService.createVehicle(request));
        response.setCode(201);
        return response;
    }

    @Operation(summary = "Xóa xe", description = "Admin/Staff xóa xe khỏi hệ thống")
    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteVehicle(@PathVariable Long id) {
        ApiResponse<Void> response = new ApiResponse<>();
        vehicleService.deleteVehicle(id);
        response.setSuccess(true);
        response.setMessage("Xóa xe thành công");
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem xe theo trạng thái", description = "Lọc xe theo status (AVAILABLE, RENTED, v.v.)")
    @PostMapping("/showbystatus")
    public ApiResponse<List<VehicleResponse>> showAllVehicleByStatus(@Valid @RequestBody ShowVehicleByStatusRequest request) {
        ApiResponse<List<VehicleResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy xe theo status thành công");
        response.setData(vehicleService.showByStatus(request.getStatus()));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem xe đang hoạt động theo trạm", description = "Lấy danh sách xe available tại một trạm")
    @PostMapping("/showactivebystation")
    public ApiResponse<List<ActiveVehicleResponse>> showActiveVehiclesByStation(
            @RequestBody ShowActiveVehicleByStationRequest request) {
        ApiResponse<List<ActiveVehicleResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin các xe đang hoạt động của trạm thành công");
        response.setData(vehicleService.getActiveVehiclesByStation(request.getStationName()));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Danh sách xe để cập nhật", description = "Lấy xe có thể thay thế cho booking")
    @PostMapping("/showtoupdate")
    public ApiResponse<List<VehicleResponse>> showVehicleToUpdate(@Valid @RequestBody StopRentingRequest request){
        ApiResponse<List<VehicleResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(vehicleService.getVehicleToUpdate(request.getBookingId()));
        response.setCode(200);
        response.setMessage("Lấy danh sách xe thành công");
        return response;
    }
}