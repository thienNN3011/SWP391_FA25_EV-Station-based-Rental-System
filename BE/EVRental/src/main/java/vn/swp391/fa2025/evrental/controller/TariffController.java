package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.swp391.fa2025.evrental.dto.request.TariffCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.TariffUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
<<<<<<< HEAD
import vn.swp391.fa2025.evrental.dto.response.TariffUpdateResponse;
=======
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
import vn.swp391.fa2025.evrental.service.TariffService;

import java.util.List;

@RestController
<<<<<<< HEAD
@RequestMapping("/tariff")
public class TariffController {

=======
@RequestMapping("/tariffs")
public class TariffController {
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
    @Autowired
    private TariffService tariffService;

    @GetMapping("/showall")
<<<<<<< HEAD
    public ApiResponse<List<TariffResponse>> showAllTariff() {
        ApiResponse<List<TariffResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả tariff thành công");
        response.setData(tariffService.showAllTariff());
=======
    public ApiResponse<List<TariffResponse>> showAllTariffs() {
        ApiResponse<List<TariffResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin tất cả bảng giá thành công");
        response.setData(tariffService.showAllTariffs());
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setCode(200);
        return response;
    }

    @GetMapping("/showbyid/{id}")
    public ApiResponse<TariffResponse> getTariffById(@PathVariable Long id) {
        ApiResponse<TariffResponse> response = new ApiResponse<>();
        response.setSuccess(true);
<<<<<<< HEAD
        response.setMessage("Lấy thông tin tariff thành công");
=======
        response.setMessage("Lấy thông tin bảng giá thành công");
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setData(tariffService.getTariffById(id));
        response.setCode(200);
        return response;
    }

<<<<<<< HEAD
    @PostMapping("/create")
    public ApiResponse<TariffResponse> createTariff(@Valid @RequestBody TariffCreateRequest request) {
        ApiResponse<TariffResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo tariff thành công");
=======
    @GetMapping("/showbymodel/{modelId}")
    public ApiResponse<List<TariffResponse>> getTariffsByModelId(@PathVariable Long modelId) {
        ApiResponse<List<TariffResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy thông tin bảng giá theo mẫu xe thành công");
        response.setData(tariffService.getTariffsByModelId(modelId));
        response.setCode(200);
        return response;
    }

    @PostMapping("/create")
    public ApiResponse<TariffResponse> createTariff(
            @Valid @RequestBody TariffCreateRequest request) {
        ApiResponse<TariffResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Tạo bảng giá mới thành công");
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setData(tariffService.createTariff(request));
        response.setCode(201);
        return response;
    }

    @PutMapping("/update/{id}")
<<<<<<< HEAD
    public ApiResponse<TariffUpdateResponse> updateTariff(
            @PathVariable Long id,
            @Valid @RequestBody TariffUpdateRequest request) {
        ApiResponse<TariffUpdateResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật tariff thành công");
=======
    public ApiResponse<TariffResponse> updateTariff(
            @PathVariable Long id,
            @Valid @RequestBody TariffUpdateRequest request) {
        ApiResponse<TariffResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật thông tin bảng giá thành công");
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setData(tariffService.updateTariff(id, request));
        response.setCode(200);
        return response;
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteTariff(@PathVariable Long id) {
        ApiResponse<Void> response = new ApiResponse<>();
        tariffService.deleteTariff(id);
        response.setSuccess(true);
<<<<<<< HEAD
        response.setMessage("Xóa tariff thành công");
=======
        response.setMessage("Xóa bảng giá thành công");
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        response.setCode(200);
        return response;
    }
}