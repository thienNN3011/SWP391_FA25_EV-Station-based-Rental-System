package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.TariffCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.TariffUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffUpdateResponse;
import vn.swp391.fa2025.evrental.service.TariffService;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@Tag(name = "Tariff Management", description = "Quản lý bảng giá")
@RestController
@RequestMapping("/tariff")
public class TariffController {

    @Autowired
    private TariffService tariffService;

    @Operation(summary = "Xem tất cả bảng giá", description = "Lấy danh sách tất cả bảng giá")
    @GetMapping("/showall")
    public ApiResponse<List<TariffResponse>> showAllTariff() {
        ApiResponse<List<TariffResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả tariff thành công");
        response.setData(tariffService.showAllTariff());
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xem bảng giá theo ID", description = "Lấy thông tin chi tiết một bảng giá")
    @GetMapping("/showbyid/{id}")
    public ApiResponse<TariffResponse> getTariffById(@PathVariable Long id) {
        ApiResponse<TariffResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tariff thành công");
        response.setData(tariffService.getTariffById(id));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Tạo bảng giá", description = "Admin tạo bảng giá cho mẫu xe tại trạm")
    @PostMapping("/create")
    public ApiResponse<TariffResponse> createTariff(@Valid @RequestBody TariffCreateRequest request) {
        ApiResponse<TariffResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo tariff thành công");
        response.setData(tariffService.createTariff(request));
        response.setCode(201);
        return response;
    }

    @Operation(summary = "Cập nhật bảng giá", description = "Admin cập nhật giá thuê xe")
    @PutMapping("/update/{id}")
    public ApiResponse<TariffUpdateResponse> updateTariff(
            @PathVariable Long id,
            @Valid @RequestBody TariffUpdateRequest request) {
        ApiResponse<TariffUpdateResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật tariff thành công");
        response.setData(tariffService.updateTariff(id, request));
        response.setCode(200);
        return response;
    }

    @Operation(summary = "Xóa bảng giá", description = "Admin xóa bảng giá")
    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteTariff(@PathVariable Long id) {
        ApiResponse<Void> response = new ApiResponse<>();
        tariffService.deleteTariff(id);
        response.setSuccess(true);
        response.setMessage("Xóa tariff thành công");
        response.setCode(200);
        return response;
    }
}