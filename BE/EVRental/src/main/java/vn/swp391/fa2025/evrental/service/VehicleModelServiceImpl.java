package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
import vn.swp391.fa2025.evrental.mapper.VehicleModelMapper;
import vn.swp391.fa2025.evrental.repository.ModelImageUrlRepository;
import vn.swp391.fa2025.evrental.repository.StationRepository;
import vn.swp391.fa2025.evrental.repository.VehicleModelRepository;
import vn.swp391.fa2025.evrental.repository.VehicleRepository;

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
    private VehicleModelMapper vehicleModelMapper;

    @Autowired
    private ModelImageUrlRepository modelImageUrlRepository;


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
    public List<VehicleModelResponse> showAllVehicleModels() {
        return vehicleModelRepository.findAll().stream()
                .map(vehicleModelMapper::toVehicleModelResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleModelResponse getVehicleModelById(Long id) {
        VehicleModel vehicleModel = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu xe với ID: " + id));
        return vehicleModelMapper.toVehicleModelResponse(vehicleModel);
    }

    @Override
    @Transactional
    public VehicleModelResponse createVehicleModel(VehicleModelCreateRequest request) {
        // Kiểm tra tên mẫu xe đã tồn tại chưa (nếu cần)
        if (vehicleModelRepository.existsByNameAndBrand(request.getName(), request.getBrand())) {
            throw new BusinessException("Mẫu xe với tên '" + request.getName() +
                    "' và thương hiệu '" + request.getBrand() + "' đã tồn tại");
        }

        VehicleModel vehicleModel = vehicleModelMapper.toVehicleModelFromCreateRequest(request);
        VehicleModel savedModel = vehicleModelRepository.save(vehicleModel);

        // Xử lý image URLs nếu có
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ModelImageUrl> imageUrls = request.getImageUrls().stream()
                    .map(imgReq -> {
                        ModelImageUrl img = new ModelImageUrl();
                        img.setImageUrl(imgReq.getImageUrl());
                        img.setColor(imgReq.getColor());
                        img.setModel(savedModel);
                        return img;
                    })
                    .collect(Collectors.toList());

            modelImageUrlRepository.saveAll(imageUrls);
            savedModel.setImageUrls(imageUrls);
        }

        return vehicleModelMapper.toVehicleModelResponse(savedModel);
    }

    @Override
    @Transactional
    public VehicleModelResponse updateVehicleModel(Long id, VehicleModelUpdateRequest request) {
        VehicleModel vehicleModel = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu xe với ID: " + id));

        boolean isUpdated = false;

        if (request.getName() != null && !request.getName().isBlank()) {
            if (!vehicleModel.getName().equals(request.getName())) {
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

        if (request.getDescription() != null) {
            if (vehicleModel.getDescription() == null ||
                    !vehicleModel.getDescription().equals(request.getDescription())) {
                vehicleModel.setDescription(request.getDescription());
                isUpdated = true;
            }
        }

        // Cập nhật image URLs nếu có
        if (request.getImageUrls() != null) {
            // Xóa ảnh cũ
            if (vehicleModel.getImageUrls() != null && !vehicleModel.getImageUrls().isEmpty()) {
                modelImageUrlRepository.deleteByModel_ModelId(id);
            }

            // Thêm ảnh mới
            List<ModelImageUrl> newImageUrls = request.getImageUrls().stream()
                    .map(imgReq -> {
                        ModelImageUrl img = new ModelImageUrl();
                        img.setImageUrl(imgReq.getImageUrl());
                        img.setColor(imgReq.getColor());
                        img.setModel(vehicleModel);
                        return img;
                    })
                    .collect(Collectors.toList());

            modelImageUrlRepository.saveAll(newImageUrls);
            vehicleModel.setImageUrls(newImageUrls);
            isUpdated = true;
        }

        if (!isUpdated) {
            throw new BusinessException("Không có thông tin nào được thay đổi");
        }

        VehicleModel updatedModel = vehicleModelRepository.save(vehicleModel);
        return vehicleModelMapper.toVehicleModelResponse(updatedModel);
    }

    @Override
    @Transactional
    public void deleteVehicleModel(Long id) {
        VehicleModel vehicleModel = vehicleModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu xe với ID: " + id));

        // Kiểm tra xem có xe nào đang sử dụng model này không
        if (vehicleModel.getVehicles() != null && !vehicleModel.getVehicles().isEmpty()) {
            throw new BusinessException("Không thể xóa mẫu xe đang được sử dụng bởi " +
                    vehicleModel.getVehicles().size() + " xe");
        }

        // Kiểm tra xem có tariff nào đang liên kết với model này không
        if (vehicleModel.getTariffs() != null && !vehicleModel.getTariffs().isEmpty()) {
            throw new BusinessException("Không thể xóa mẫu xe đang có bảng giá liên kết");
        }

        modelImageUrlRepository.deleteByModel_ModelId(id);

        vehicleModelRepository.delete(vehicleModel);
    }
}
