package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.ModelImageUrlResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.entity.ModelImageUrl;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
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
}
