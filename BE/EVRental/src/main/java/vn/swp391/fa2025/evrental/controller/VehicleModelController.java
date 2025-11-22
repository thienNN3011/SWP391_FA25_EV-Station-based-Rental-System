    package vn.swp391.fa2025.evrental.controller;

    import jakarta.validation.Valid;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.MediaType;
    import org.springframework.web.bind.annotation.*;
    import vn.swp391.fa2025.evrental.dto.request.*;
    import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
    import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
    import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
    import vn.swp391.fa2025.evrental.service.VehicleModelService;

    import io.swagger.v3.oas.annotations.Operation;
    import io.swagger.v3.oas.annotations.tags.Tag;
    import io.swagger.v3.oas.annotations.security.SecurityRequirement;

    import java.util.List;

    @Tag(name = "Vehicle Model Management", description = "Quản lý mẫu xe")
    @RestController
    @RequestMapping("/vehiclemodel")
    public class VehicleModelController {
        @Autowired
        private VehicleModelService vehicleModelService;

        @Operation(summary = "Xem mẫu xe theo trạm", description = "Lấy danh sách mẫu xe với bảng giá active tại trạm")
        @PostMapping
        ApiResponse<List<VehicleModelResponse>> getVehicleModelsByStationWithActiveTariffs(@Valid @RequestBody ShowModelByStaionRequest request) {
            ApiResponse<List<VehicleModelResponse>> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Lấy thông tin các mẫu xe với bảng giá đang hoạt động của trạm thành công");
            response.setData(vehicleModelService.getVihecleModelsByStationWithActiveTariffs(request.getStationName()));
            response.setCode(200);
            return response;
        }

        @Operation(summary = "Chi tiết mẫu xe tại trạm", description = "Lấy thông tin chi tiết mẫu xe theo ID và trạm")
        @PostMapping("/getvehicelmodeldetail")
        ApiResponse<VehicleModelResponse> getVehicleModelDetailByModelIdAndStation(@Valid @RequestBody VehicleModelDetailRequest request){
            ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Lấy thông tin của mẫu xe thành công");
            response.setData(vehicleModelService.getVihecleModelByVehicleModelIdAndStationName(request.getStationName(), request.getModelId()));
            response.setCode(200);
            return response;
        }

        @Operation(summary = "Xem tất cả mẫu xe", description = "Lấy danh sách tất cả mẫu xe trong hệ thống")
        @GetMapping("/showall")
         ApiResponse<List<VehicleModelResponse>> showAllVehicleModel() {
            ApiResponse<List<VehicleModelResponse>> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Lấy thông tin tất cả model xe thành công");
            response.setData(vehicleModelService.showAllVehicleModel());
            response.setCode(200);
            return response;
        }

        @Operation(summary = "Xem mẫu xe theo ID", description = "Lấy thông tin chi tiết một mẫu xe")
        @GetMapping("/showbyid/{id}")
        public ApiResponse<VehicleModelResponse> getVehicleModelById(@PathVariable Long id) {
            ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Lấy thông tin xe thành công");
            response.setData(vehicleModelService.getVehicleModelById(id));
            response.setCode(200);
            return response;
        }

        @Operation(summary = "Tạo mẫu xe mới", description = "Admin thêm mẫu xe vào hệ thống")
        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        ApiResponse<VehicleModelResponse> createVehicleModel(
                @Valid @RequestBody VehicleModelCreateRequest request) {
            ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Tạo mẫu xe thành công");
            response.setData(vehicleModelService.createVehicleModel(request));
            response.setCode(201);
            return response;
        }

        @Operation(summary = "Cập nhật mẫu xe", description = "Admin cập nhật thông tin mẫu xe")
        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        ApiResponse<VehicleModelResponse> updateVehicleModel(
                @PathVariable Long id,
                @Valid @RequestBody VehicleModelUpdateRequest request) {
            ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Cập nhật mẫu xe thành công");
            response.setData(vehicleModelService.updateVehicleModel(id, request));
            response.setCode(200);
            return response;
        }

        @Operation(summary = "Thêm hình ảnh cho mẫu xe", description = "Admin thêm ảnh cho mẫu xe")
        @PostMapping(value = "/addimages/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        ApiResponse<VehicleModelResponse> addImagesToVehicleModel(
                @PathVariable Long id,
                @Valid @RequestBody VehicleModelAddImageRequest request) {
            ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Thêm hình ảnh cho mẫu xe thành công");
            response.setData(vehicleModelService.addImagesToVehicleModel(id, request));
            response.setCode(200);
            return response;
        }

        @Operation(summary = "Xóa mẫu xe", description = "Admin xóa mẫu xe khỏi hệ thống")
        @DeleteMapping("/delete/{id}")
        ApiResponse<Void> deleteVehicleModel(@PathVariable Long id) {
            ApiResponse<Void> response = new ApiResponse<>();
            vehicleModelService.deleteVehicleModel(id);
            response.setSuccess(true);
            response.setMessage("Xóa mẫu xe thành công");
            response.setData(null);
            response.setCode(200);
            return response;
        }

        @Operation(summary = "Xóa hình ảnh mẫu xe", description = "Admin xóa ảnh của mẫu xe")
        @DeleteMapping(value = "/deleteimage/{modelId}", consumes = MediaType.APPLICATION_JSON_VALUE)
        ApiResponse<Void> deleteImageFromVehicleModel(
                @PathVariable Long modelId,
                @Valid @RequestBody VehicleModelDeleteImageRequest request) {
            ApiResponse<Void> response = new ApiResponse<>();
            vehicleModelService.deleteImageFromVehicleModel(modelId, request);
            response.setSuccess(true);
            response.setMessage("Xóa hình ảnh thành công");
            response.setData(null);
            response.setCode(200);
            return response;
        }
    }
