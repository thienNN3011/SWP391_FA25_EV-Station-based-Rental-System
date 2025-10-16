package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import vn.swp391.fa2025.evrental.dto.request.VehicleRequest;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.mapper.VehicleMapper;
import vn.swp391.fa2025.evrental.repository.StationRepository;
import vn.swp391.fa2025.evrental.repository.VehicleModelRepository;
import vn.swp391.fa2025.evrental.repository.VehicleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Validated
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleModelRepository vehicleModelRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private VehicleMapper vehicleMapper;

    @Override
    public List<VehicleResponse> showAllVehicle() {
        return vehicleRepository.findAll().stream()
                .map(vehicleMapper::toVehicleResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với ID: " + id));
        return vehicleMapper.toVehicleResponse(vehicle);
    }

    @Override
    @Transactional
    public VehicleResponse createVehicle(VehicleRequest.VehicleCreateRequest request) {

        VehicleModel model = vehicleModelRepository.findById(request.getModelId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + request.getModelId()));

        Station station = stationRepository.findById(request.getStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + request.getStationId()));

        if (!"OPEN".equals(station.getStatus())) {
            throw new BusinessException("Trạm hiện không hoạt động");
        }

        if (vehicleRepository.findByPlateNumber(request.getPlateNumber()).isPresent()) {
            throw new BusinessException("Biển số xe đã tồn tại: " + request.getPlateNumber());
        }

        Vehicle vehicle = vehicleMapper.toVehicleFromCreateRequest(request);
        vehicle.setModel(model);
        vehicle.setStation(station);
        vehicle.setStatus("AVAILABLE");

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toVehicleResponse(savedVehicle);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleRequest.VehicleUpdateRequest request) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với ID: " + id));

        VehicleModel model = vehicleModelRepository.findById(request.getModelId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + request.getModelId()));

        Station station = stationRepository.findById(request.getStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + request.getStationId()));

        if (!"OPEN".equals(station.getStatus())) {
            throw new BusinessException("Trạm hiện không hoạt động");
        }

        vehicleRepository.findByPlateNumber(request.getPlateNumber())
                .ifPresent(existingVehicle -> {
                    if (!existingVehicle.getVehicleId().equals(id)) {
                        throw new BusinessException("Biển số xe đã tồn tại: " + request.getPlateNumber());
                    }
                });

        vehicle.setModel(model);
        vehicle.setStation(station);
        vehicle.setColor(request.getColor());
        vehicle.setPlateNumber(request.getPlateNumber());
        vehicle.setStatus(request.getStatus());

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toVehicleResponse(updatedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với ID: " + id));

        if ("IN_USE".equalsIgnoreCase(vehicle.getStatus())) {
            throw new BusinessException("Không thể xóa xe đang được sử dụng");
        }

        vehicle.setStatus("INACTIVE");
        vehicleRepository.save(vehicle);
    }
}