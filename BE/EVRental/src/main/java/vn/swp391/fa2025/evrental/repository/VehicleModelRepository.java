package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.VehicleModel;

import java.util.List;

@Repository
public interface VehicleModelRepository extends JpaRepository<VehicleModel,Long> {
    List<VehicleModel> findDistinctByVehiclesStationStationName(String stationName);

    VehicleModel findByModelId(Long modelId);

    VehicleModel findFirstByModelIdAndVehiclesStationStationName(Long modelId, String stationName);
    boolean existsByNameAndBrand(String name, String brand);
}