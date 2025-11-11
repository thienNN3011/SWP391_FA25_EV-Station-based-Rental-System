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

    import java.util.List;
    @RestController
    @RequestMapping("/vehiclemodel")
    public class VehicleModelController {
        @Autowired
        private VehicleModelService vehicleModelService;

        @PostMapping
        ApiResponse<List<VehicleModelResponse>> getVehicleModelsByStationWithActiveTariffs(@Valid @RequestBody ShowModelByStaionRequest request) {
            ApiResponse<List<VehicleModelResponse>> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Lấy thông tin các mẫu xe với bảng giá đang hoạt động của trạm thành công");
            response.setData(vehicleModelService.getVihecleModelsByStationWithActiveTariffs(request.getStationName()));
            response.setCode(200);
            return response;
        }

        @PostMapping("/getvehicelmodeldetail")
        ApiResponse<VehicleModelResponse> getVehicleModelDetailByModelIdAndStation(@Valid @RequestBody VehicleModelDetailRequest request){
            ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Lấy thông tin của mẫu xe thành công");
            response.setData(vehicleModelService.getVihecleModelByVehicleModelIdAndStationName(request.getStationName(), request.getModelId()));
            response.setCode(200);
            return response;
        }

        @GetMapping("/showall")
         ApiResponse<List<VehicleModelResponse>> showAllVehicleModel() {
            ApiResponse<List<VehicleModelResponse>> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Lấy thông tin tất cả model xe thành công");
            response.setData(vehicleModelService.showAllVehicleModel());
            response.setCode(200);
            return response;
        }
        @GetMapping("/showbyid/{id}")
        public ApiResponse<VehicleModelResponse> getVehicleModelById(@PathVariable Long id) {
            ApiResponse<VehicleModelResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Lấy thông tin xe thành công");
            response.setData(vehicleModelService.getVehicleModelById(id));
            response.setCode(200);
            return response;
        }

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
