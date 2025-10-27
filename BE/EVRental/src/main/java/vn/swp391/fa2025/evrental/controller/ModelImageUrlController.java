package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.swp391.fa2025.evrental.dto.request.AddModelImageRequest;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import vn.swp391.fa2025.evrental.dto.response.ModelImageUrlResponse;
import vn.swp391.fa2025.evrental.service.ModelImageUrlService;

import java.util.List;

@RestController
@RequestMapping("/vehiclemodel")
@RequiredArgsConstructor
public class ModelImageUrlController {

    private final ModelImageUrlService imageService;


    @GetMapping("/{modelId}/images")
    public ApiResponse<List<ModelImageUrlResponse>> getImagesByModelId(@PathVariable Long modelId) {
        ApiResponse<List<ModelImageUrlResponse>> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Lấy danh sách ảnh thành công");
        response.setData(imageService.getImagesByModelId(modelId));
        response.setCode(200);
        return response;
    }


    @PostMapping(value = "/{modelId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ModelImageUrlResponse> addImageToModel(
            @PathVariable Long modelId,
            @Valid @ModelAttribute AddModelImageRequest request) {
        ApiResponse<ModelImageUrlResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Thêm ảnh thành công");
        response.setData(imageService.addImageToModel(modelId, request));
        response.setCode(201);
        return response;
    }


    @DeleteMapping("/{modelId}/images/{imageId}")
    public ApiResponse<Void> deleteImageFromModel(
            @PathVariable Long modelId,
            @PathVariable Long imageId) {
        imageService.deleteImageFromModel(modelId, imageId);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Xóa ảnh thành công");
        response.setCode(200);
        return response;
    }

    // PUT /vehiclemodel/images/{imageId} - Cập nhật ảnh
    @PutMapping(value = "/images/{imageId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ModelImageUrlResponse> updateImage(
            @PathVariable Long imageId,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) String color) {
        ApiResponse<ModelImageUrlResponse> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Cập nhật ảnh thành công");
        response.setData(imageService.updateImage(imageId, image, color));
        response.setCode(200);
        return response;
    }
}