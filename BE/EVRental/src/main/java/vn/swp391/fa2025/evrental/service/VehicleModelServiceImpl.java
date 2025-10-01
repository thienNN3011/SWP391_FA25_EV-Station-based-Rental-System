package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleModelResponse;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
import vn.swp391.fa2025.evrental.repository.VehicleModelRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class VehicleModelServiceImpl implements VehicleModelService {
    @Autowired
    private VehicleModelRepository vehicleModelRepository;

    @Override
    public List<VehicleModelResponse> getVihecleModelsWithActiveTariffs() {
        List<VehicleModel> models= vehicleModelRepository.findAll();

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

            return new VehicleModelResponse(
                    model.getModelId(),
                    model.getName(),
                    model.getBrand(),
                    model.getBatteryCapacity(),
                    model.getRange(),
                    model.getSeat(),
                    model.getDescription(),
                    model.getImageUrl(),
                    activeTariffs,
                    availableColors
            );
        }).toList();
    }
}
