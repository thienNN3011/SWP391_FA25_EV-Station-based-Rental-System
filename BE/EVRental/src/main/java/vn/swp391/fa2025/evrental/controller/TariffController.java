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

@RestController
@RequestMapping("/tariff")
public class TariffController {

    @Autowired
    private TariffService tariffService;

    @GetMapping("/showall")
    public ApiResponse<List<TariffResponse>> showAllTariff() {
        ApiResponse<List<TariffResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả tariff thành công");
        response.setData(tariffService.showAllTariff());
        response.setCode(200);
        return response;
    }

    @GetMapping("/showbyid/{id}")
    public ApiResponse<TariffResponse> getTariffById(@PathVariable Long id) {
        ApiResponse<TariffResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tariff thành công");
        response.setData(tariffService.getTariffById(id));
        response.setCode(200);
        return response;
    }

    @PostMapping("/create")
    public ApiResponse<TariffResponse> createTariff(@Valid @RequestBody TariffCreateRequest request) {
        ApiResponse<TariffResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo tariff thành công");
        response.setData(tariffService.createTariff(request));
        response.setCode(201);
        return response;
    }

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