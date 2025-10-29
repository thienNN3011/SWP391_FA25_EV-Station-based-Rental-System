package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import vn.swp391.fa2025.evrental.dto.request.VehicleCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.ActiveVehicleResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.mapper.VehicleMapper;
import vn.swp391.fa2025.evrental.repository.StationRepository;
import vn.swp391.fa2025.evrental.repository.UserRepository;
import vn.swp391.fa2025.evrental.repository.VehicleModelRepository;
import vn.swp391.fa2025.evrental.repository.VehicleRepository;

import java.util.ArrayList;
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

    @Autowired
    private UserRepository userRepository;
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
    public VehicleResponse createVehicle(VehicleCreateRequest request) {

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
    public VehicleResponse updateVehicle(Long id, VehicleUpdateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với ID: " + id));

        boolean isUpdated = false;


        if (request.getModelId() != null) {
            if (!vehicle.getModel().getModelId().equals(request.getModelId())) {
                VehicleModel model = vehicleModelRepository.findById(request.getModelId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + request.getModelId()));
                vehicle.setModel(model);
                isUpdated = true;
            }
        }


        if (request.getStationId() != null) {
            if (!vehicle.getStation().getStationId().equals(request.getStationId())) {
                Station station = stationRepository.findById(request.getStationId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + request.getStationId()));

                if (!"OPEN".equals(station.getStatus())) {
                    throw new BusinessException("Trạm hiện không hoạt động");
                }
                vehicle.setStation(station);
                isUpdated = true;
            }
        }

        if (request.getPlateNumber() != null && !request.getPlateNumber().isBlank()) {
            if (!vehicle.getPlateNumber().equals(request.getPlateNumber())) {
                if (vehicleRepository.findByPlateNumber(request.getPlateNumber()).isPresent()) {
                    throw new BusinessException("Biển số xe đã tồn tại: " + request.getPlateNumber());
                }
                vehicle.setPlateNumber(request.getPlateNumber());
                isUpdated = true;
            }
        }


        if (request.getColor() != null && !request.getColor().isBlank()) {
            if (!vehicle.getColor().equals(request.getColor())) {
                vehicle.setColor(request.getColor());
                isUpdated = true;
            }
        }


        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            if (!vehicle.getStatus().equals(request.getStatus())) {
                vehicle.setStatus(request.getStatus());
                isUpdated = true;
            }
        }


        if (!isUpdated) {
            throw new BusinessException("Không có thông tin nào được thay đổi");
        }

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toVehicleResponse(updatedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với ID: " + id));

        if ("INACTIVE".equals(vehicle.getStatus())) {
            throw new BusinessException("Xe đã ở trạng thái INACTIVE");
        }


        if ("IN_USE".equalsIgnoreCase(vehicle.getStatus())) {
            throw new BusinessException("Không thể xóa xe đang được sử dụng");
        }

        vehicle.setStatus("INACTIVE");
        vehicleRepository.save(vehicle);
    }

    @Override
    public List<VehicleResponse> showByStatus(String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffname = authentication.getName();
        User staff=userRepository.findByUsername(staffname);
        status=status.toUpperCase();
        String[] statusList={"ALL", "AVAILABLE", "UNAVAILABLE", "IN_USE", "MAINTENANCE"};
        boolean ok=false;
        for (String st: statusList){
            if (status.equals(st)){
                ok=true;
                break;
            }
        }
        if (!ok) throw new RuntimeException("Status không hợp lệ");
        List<Vehicle> vehicles=new ArrayList<>();
        if (status.equals("ALL")) vehicles=vehicleRepository.findByStation_StationId(staff.getStation().getStationId());
        else vehicles=vehicleRepository.findByStation_StationIdAndStatus(staff.getStation().getStationId(), status);
        return vehicleMapper.toShortVehicleResponseList(vehicles);
    }


    public List<ActiveVehicleResponse> getActiveVehiclesByStation(String stationName) {

        Station station = stationRepository.findByStationName(stationName);
        if (station == null) {
            throw new ResourceNotFoundException("Không tìm thấy trạm: " + stationName);
        }
        if (!"OPEN".equals(station.getStatus())) {
            throw new BusinessException("Trạm hiện không hoạt động");
        }


        List<Vehicle> vehicles = vehicleRepository.findByStation_StationNameAndStatus(
                stationName,
                "AVAILABLE"
        );


        return vehicles.stream()
                .map(vehicle -> {

                    ActiveVehicleResponse response = vehicleMapper.toActiveVehicleResponse(vehicle);


                    List<TariffResponse> activeTariffs = vehicle.getModel().getTariffs().stream()
                            .filter(t -> "active".equalsIgnoreCase(t.getStatus()))
                            .map(t -> new TariffResponse(
                                    t.getTariffId(),
                                    t.getType(),
                                    t.getPrice(),
                                    t.getDepositAmount()
                            ))
                            .toList();

                    response.setTariffs(activeTariffs);
                    return response;
                })
                .toList();
    }
}