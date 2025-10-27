package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleModelUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.ModelImageUrlResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.entity.ModelImageUrl;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.mapper.ModelVehicleMapper;
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
    private FileStorageService fileStorageService;

    @Override
    public List<VehicleModelResponse> getVihecleModelsByStationWithActiveTariffs(String stationName) {
        if (stationRepository.findByStationName(stationName) == null || !stationRepository.findByStationName(stationName).getStatus().equals("OPEN")) throw new IllegalArgumentException("Station is inactive or does not exist");
        List<VehicleModel> models= vehicleModelRepository.findDistinctByVehiclesStationStationName(stationName);

        return models.stream().map(model -> {
            List<TariffResponse> activeTariffs = model.getTariffs().stream()
                    .filter(t -> "active".equalsIgnoreCase(t.getStatus()))
                    .map(t -> new TariffResponse(
                            t.getTariffId(),
                            t.getType(),
                            t.getPrice(),
                            t.getDepositAmount()
                    ))
                    .toList();

            Set<String> availableColors = model.getVehicles().stream()
                    .filter(vehicle -> "available".equalsIgnoreCase(vehicle.getStatus()))
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
        if (stationRepository.findByStationName(stationName) == null || !stationRepository.findByStationName(stationName).getStatus().equals("OPEN")) throw new IllegalArgumentException("Station is inactive or does not exist");
        if (vehicleModelRepository.findByModelId(modelId) == null) throw new RuntimeException("Model xe bạn chọn không tồn tại");
        if (vehicleRepository.findFirstByModel_ModelIdAndStation_StationName(modelId, stationName)==null) throw new RuntimeException("Model này hiện tại không có xe trong Station được chọn");
        VehicleModel model = vehicleModelRepository.findFirstByModelIdAndVehiclesStationStationName(modelId, stationName);
        List<TariffResponse> activeTariffs = model.getTariffs().stream()
                .filter(t -> "active".equalsIgnoreCase(t.getStatus()))
                .map(t -> new TariffResponse(
                        t.getTariffId(),
                        t.getType(),
                        t.getPrice(),
                        t.getDepositAmount()
                ))
                .toList();

        Set<String> availableColors = model.getVehicles().stream()
                .filter(vehicle -> "available".equalsIgnoreCase(vehicle.getStatus()))
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
        // Validate tên model xe không được trùng lặp
        if (vehicleModelRepository.existsByName(request.getName())) {
            throw new BusinessException("Tên model xe đã tồn tại: " + request.getName());
        }

        // Validate số lượng ảnh và màu phải khớp
        if (request.getImages().size() != request.getColors().size()) {
            throw new BusinessException("Số lượng ảnh và màu không khớp");
        }

        // Validate không có màu trùng lặp
        long distinctColors = request.getColors().stream().distinct().count();
        if (distinctColors != request.getColors().size()) {
            throw new BusinessException("Không được có màu trùng lặp");
        }

        // Tạo VehicleModel entity (không set imageUrls ở đây)
        VehicleModel vehicleModel = VehicleModel.builder()
                .name(request.getName())
                .brand(request.getBrand())
                .batteryCapacity(request.getBatteryCapacity())
                .range(request.getRange())
                .seat(request.getSeat())
                .description(request.getDescription())
                .build();

        // Lưu VehicleModel trước để có modelId
        vehicleModel = vehicleModelRepository.save(vehicleModel);

        // Tạo danh sách ModelImageUrl
        List<ModelImageUrl> imageUrls = new ArrayList<>();
        for (int i = 0; i < request.getImages().size(); i++) {
            // Validate file ảnh
            if (request.getImages().get(i).isEmpty()) {
                throw new BusinessException("File ảnh thứ " + (i + 1) + " không được rỗng");
            }

            // Lưu file ảnh và lấy đường dẫn
            String imagePath = fileStorageService.saveImage(
                    request.getImages().get(i),
                    "vehiclemodel"
            );

            // Tạo ModelImageUrl entity
            ModelImageUrl imageUrl = ModelImageUrl.builder()
                    .imageUrl(imagePath)
                    .color(request.getColors().get(i))
                    .model(vehicleModel)
                    .build();

            imageUrls.add(imageUrl);
        }

        // Set imageUrls cho vehicleModel
        vehicleModel.setImageUrls(imageUrls);

        // Lưu lại để persist imageUrls (nhờ cascade)
        vehicleModel = vehicleModelRepository.save(vehicleModel);

        return modelVehicleMapper.toVehicleModelResponse(vehicleModel);
    }
    @Override
    @Transactional
    public VehicleModelResponse updateVehicleModel(Long id, VehicleModelUpdateRequest request) {
        VehicleModel vehicleModel = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + id));

        boolean isUpdated = false;

        // Update name
        if (request.getName() != null && !request.getName().isBlank()) {
            if (!vehicleModel.getName().equals(request.getName())) {
                if (vehicleModelRepository.existsByName(request.getName())) {
                    throw new BusinessException("Tên model xe đã tồn tại: " + request.getName());
                }
                vehicleModel.setName(request.getName());
                isUpdated = true;
            }
        }

        // Update brand
        if (request.getBrand() != null && !request.getBrand().isBlank()) {
            if (!vehicleModel.getBrand().equals(request.getBrand())) {
                vehicleModel.setBrand(request.getBrand());
                isUpdated = true;
            }
        }

        // Update batteryCapacity
        if (request.getBatteryCapacity() != null) {
            if (!vehicleModel.getBatteryCapacity().equals(request.getBatteryCapacity())) {
                vehicleModel.setBatteryCapacity(request.getBatteryCapacity());
                isUpdated = true;
            }
        }

        // Update range
        if (request.getRange() != null) {
            if (!vehicleModel.getRange().equals(request.getRange())) {
                vehicleModel.setRange(request.getRange());
                isUpdated = true;
            }
        }

        // Update seat
        if (request.getSeat() != null) {
            if (!vehicleModel.getSeat().equals(request.getSeat())) {
                vehicleModel.setSeat(request.getSeat());
                isUpdated = true;
            }
        }

        // Update description
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
}


