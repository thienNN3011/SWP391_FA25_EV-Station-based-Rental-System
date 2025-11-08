package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelAddImageRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelDeleteImageRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.ModelImageUrlResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.entity.ModelImageUrl;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
import vn.swp391.fa2025.evrental.enums.VehicleStatus;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.mapper.ModelVehicleMapper;
import vn.swp391.fa2025.evrental.repository.ModelImageUrlRepository;
import vn.swp391.fa2025.evrental.repository.StationRepository;
import vn.swp391.fa2025.evrental.repository.VehicleModelRepository;
import vn.swp391.fa2025.evrental.repository.VehicleRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class VehicleModelServiceImpl implements VehicleModelService {
    @Autowired
    private VehicleModelRepository vehicleModelRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ModelVehicleMapper modelVehicleMapper;

    @Autowired
    private ModelImageUrlRepository modelImageUrlRepository;


    @Override
    public List<VehicleModelResponse> getVihecleModelsByStationWithActiveTariffs(String stationName) {
        if (stationRepository.findByStationName(stationName) == null || !stationRepository.findByStationName(stationName).getStatus().toString().equals("OPEN")) throw new IllegalArgumentException("Station is inactive or does not exist");
        List<VehicleModel> models= vehicleModelRepository.findDistinctByVehiclesStationStationNameAndVehiclesStatus(stationName, VehicleStatus.fromString("AVAILABLE"));
        return models.stream().map(model -> {
            List<TariffResponse> activeTariffs = model.getTariffs().stream()
                    .filter(t -> "active".equalsIgnoreCase(t.getStatus().toString()))
                    .map(t -> new TariffResponse(
                            t.getTariffId(),
                            t.getType(),
                            t.getPrice(),
                            t.getDepositAmount()
                    ))
                    .toList();

            Set<String> availableColors = model.getVehicles().stream()
                    .filter(vehicle -> "available".equalsIgnoreCase(vehicle.getStatus().toString()))
                    .filter(vehicle -> stationName.equalsIgnoreCase(vehicle.getStation().getStationName()))
                    .map(Vehicle::getColor)
                    .collect(Collectors.toSet());
            List<ModelImageUrlResponse> imageUrls = model.getImageUrls().stream()
                    .map(img -> new ModelImageUrlResponse(
                            img.getImageUrl(),
                            img.getColor()
                    )).toList();
            return new VehicleModelResponse(
                    model.getModelId(),
                    stationName,
                    model.getName(),
                    model.getBrand(),
                    model.getBatteryCapacity(),
                    model.getRange(),
                    model.getSeat(),
                    model.getDescription(),
                    imageUrls,
                    activeTariffs,
                    availableColors
            );
        }).toList();
    }

    @Override
    public VehicleModelResponse getVihecleModelByVehicleModelIdAndStationName(String stationName, Long modelId) {
        if (stationRepository.findByStationName(stationName) == null || !stationRepository.findByStationName(stationName).getStatus().toString().equals("OPEN")) throw new IllegalArgumentException("Station is inactive or does not exist");
        if (vehicleModelRepository.findByModelId(modelId) == null) throw new RuntimeException("Model xe bạn chọn không tồn tại");
        if (vehicleRepository.findFirstByModel_ModelIdAndStation_StationName(modelId, stationName)==null) throw new RuntimeException("Model này hiện tại không có xe trong Station được chọn");
        VehicleModel model = vehicleModelRepository.findFirstByModelIdAndVehiclesStationStationName(modelId, stationName);
        List<TariffResponse> activeTariffs = model.getTariffs().stream()
                .filter(t -> "active".equalsIgnoreCase(t.getStatus().toString()))
                .map(t -> new TariffResponse(
                        t.getTariffId(),
                        t.getType(),
                        t.getPrice(),
                        t.getDepositAmount()
                ))
                .toList();

        Set<String> availableColors = model.getVehicles().stream()
                .filter(vehicle -> "available".equalsIgnoreCase(vehicle.getStatus().toString()))
                .map(Vehicle::getColor)
                .collect(Collectors.toSet());

        List<ModelImageUrlResponse> imageUrls = model.getImageUrls().stream()
                .map(img -> new ModelImageUrlResponse(
                        img.getImageUrl(),
                        img.getColor()
                )).toList();
        return new VehicleModelResponse(
                model.getModelId(),
                stationName,
                model.getName(),
                model.getBrand(),
                model.getBatteryCapacity(),
                model.getRange(),
                model.getSeat(),
                model.getDescription(),
                imageUrls,
                activeTariffs,
                availableColors
        );
    }

    @Override
    public List<VehicleModelResponse> showAllVehicleModel() {
        return vehicleModelRepository.findAll().stream()
                .map(modelVehicleMapper::toVehicleModelResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleModelResponse getVehicleModelById(Long id) {
        VehicleModel vehicleModel = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + id));
        return modelVehicleMapper.toVehicleModelResponse(vehicleModel);
    }

    @Override
    @Transactional
    public VehicleModelResponse createVehicleModel(VehicleModelCreateRequest request) {

        if (vehicleModelRepository.existsByName(request.getName())) {
            throw new BusinessException("Tên model xe đã tồn tại: " + request.getName());
        }


        if (request.getImages() == null || request.getImages().isEmpty()) {
            throw new BusinessException("Danh sách hình ảnh không được để trống");
        }


        for (int i = 0; i < request.getImages().size(); i++) {
            VehicleModelCreateRequest.ModelImageData imageData = request.getImages().get(i);

            if (imageData.getImageUrl() == null || imageData.getImageUrl().isBlank()) {
                throw new BusinessException("URL hình ảnh thứ " + (i + 1) + " không được để trống");
            }

            if (imageData.getColor() == null || imageData.getColor().isBlank()) {
                throw new BusinessException("Màu hình ảnh thứ " + (i + 1) + " không được để trống");
            }
        }


        VehicleModel vehicleModel = VehicleModel.builder()
                .name(request.getName())
                .brand(request.getBrand())
                .batteryCapacity(request.getBatteryCapacity())
                .range(request.getRange())
                .seat(request.getSeat())
                .description(request.getDescription())
                .build();


        vehicleModel = vehicleModelRepository.save(vehicleModel);


        List<ModelImageUrl> imageUrls = new ArrayList<>();
        VehicleModel finalVehicleModel = vehicleModel;
        for (VehicleModelCreateRequest.ModelImageData imageData : request.getImages()) {
            ModelImageUrl imageUrl = ModelImageUrl.builder().imageUrl(imageData.getImageUrl()).color(imageData.getColor()).model(finalVehicleModel)
                    .build();

            imageUrls.add(imageUrl);
        }


        vehicleModel.setImageUrls(imageUrls);


        vehicleModel = vehicleModelRepository.save(vehicleModel);

        return modelVehicleMapper.toVehicleModelResponse(vehicleModel);
    }

    @Override
    @Transactional
    public VehicleModelResponse updateVehicleModel(Long id, VehicleModelUpdateRequest request) {
        VehicleModel vehicleModel = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + id));

        boolean isUpdated = false;


        if (request.getName() != null && !request.getName().isBlank()) {
            if (!vehicleModel.getName().equals(request.getName())) {
                if (vehicleModelRepository.existsByName(request.getName())) {
                    throw new BusinessException("Tên model xe đã tồn tại: " + request.getName());
                }
                vehicleModel.setName(request.getName());
                isUpdated = true;
            }
        }


        if (request.getBrand() != null && !request.getBrand().isBlank()) {
            if (!vehicleModel.getBrand().equals(request.getBrand())) {
                vehicleModel.setBrand(request.getBrand());
                isUpdated = true;
            }
        }


        if (request.getBatteryCapacity() != null) {
            if (!vehicleModel.getBatteryCapacity().equals(request.getBatteryCapacity())) {
                vehicleModel.setBatteryCapacity(request.getBatteryCapacity());
                isUpdated = true;
            }
        }


        if (request.getRange() != null) {
            if (!vehicleModel.getRange().equals(request.getRange())) {
                vehicleModel.setRange(request.getRange());
                isUpdated = true;
            }
        }


        if (request.getSeat() != null) {
            if (!vehicleModel.getSeat().equals(request.getSeat())) {
                vehicleModel.setSeat(request.getSeat());
                isUpdated = true;
            }
        }


        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            if (!vehicleModel.getDescription().equals(request.getDescription())) {
                vehicleModel.setDescription(request.getDescription());
                isUpdated = true;
            }
        }

        if (!isUpdated) {
            throw new BusinessException("Không có thông tin nào được thay đổi");
        }

        VehicleModel updatedModel = vehicleModelRepository.save(vehicleModel);
        return modelVehicleMapper.toVehicleModelResponse(updatedModel);
    }

    @Override
    @Transactional
    public VehicleModelResponse addImagesToVehicleModel(Long id, VehicleModelAddImageRequest request) {

        VehicleModel vehicleModel = vehicleModelRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + id));


        if (request.getImages() == null || request.getImages().isEmpty()) {
            throw new BusinessException("Danh sách hình ảnh không được để trống");
        }


        for (int i = 0; i < request.getImages().size(); i++) {
            VehicleModelAddImageRequest.ImageData imageData = request.getImages().get(i);

            if (imageData.getImageUrl() == null || imageData.getImageUrl().isBlank()) {
                throw new BusinessException("URL hình ảnh thứ " + (i + 1) + " không được để trống");
            }

            if (imageData.getColor() == null || imageData.getColor().isBlank()) {
                throw new BusinessException("Màu hình ảnh thứ " + (i + 1) + " không được để trống");
            }
        }


        List<ModelImageUrl> newImages = new ArrayList<>();
        for (VehicleModelAddImageRequest.ImageData imageData : request.getImages()) {
            ModelImageUrl imageUrl = ModelImageUrl.builder().imageUrl(imageData.getImageUrl()).color(imageData.getColor()).model(vehicleModel).build();

            newImages.add(imageUrl);
        }


        modelImageUrlRepository.saveAll(newImages);


        vehicleModel = vehicleModelRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + id));

        return modelVehicleMapper.toVehicleModelResponse(vehicleModel);
    }

    @Override
    @Transactional
    public void deleteVehicleModel(Long id) {
        // Kiểm tra vehicle model có tồn tại không
        VehicleModel vehicleModel = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + id));

        // Kiểm tra xem có vehicle nào đang sử dụng model này không
        if (vehicleModel.getVehicles() != null && !vehicleModel.getVehicles().isEmpty()) {
            throw new BusinessException("Không thể xóa model xe vì đang có xe sử dụng model này");
        }

        // Kiểm tra xem có tariff nào đang liên kết với model này không
        if (vehicleModel.getTariffs() != null && !vehicleModel.getTariffs().isEmpty()) {
            throw new BusinessException("Không thể xóa model xe vì đang có bảng giá liên kết");
        }

        // Xóa tất cả images liên quan (cascade sẽ tự động xóa do orphanRemoval = true)
        vehicleModelRepository.delete(vehicleModel);
    }

    @Override
    @Transactional
    public void deleteImageFromVehicleModel(Long modelId, VehicleModelDeleteImageRequest request) {
        // Kiểm tra vehicle model có tồn tại không
        VehicleModel vehicleModel = vehicleModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + modelId));

        // Validate imageId
        if (request.getId() == null) {
            throw new BusinessException("ID hình ảnh không được để trống");
        }

        // Kiểm tra image có tồn tại không
        ModelImageUrl image = modelImageUrlRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hình ảnh với ID: " + request.getId()));

        // Kiểm tra image có thuộc về model này không
        if (!image.getModel().getModelId().equals(modelId)) {
            throw new BusinessException("Hình ảnh không thuộc về model xe này");
        }

        long imageCount = modelImageUrlRepository.countByModel_ModelId(modelId);
        if (imageCount <= 1) {
            throw new BusinessException("Không thể xóa hình ảnh. Model xe phải có ít nhất 1 hình ảnh");
        }

        modelImageUrlRepository.deleteById(request.getId());
       
    }
}