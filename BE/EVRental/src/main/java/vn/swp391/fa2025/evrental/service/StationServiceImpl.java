package vn.swp391.fa2025.evrental.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.StationCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.StationUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.enums.StationStatus;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.mapper.StationMapper;
import vn.swp391.fa2025.evrental.repository.StationRepository;
import vn.swp391.fa2025.evrental.repository.UserRepository;
import vn.swp391.fa2025.evrental.repository.VehicleRepository;
import vn.swp391.fa2025.evrental.mapper.VehicleMapper;

@Service
public class StationServiceImpl implements StationService {

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleMapper vehicleMapper;

    @Autowired
    private StationMapper stationMapper;


    @Override
    public List<StationResponse> showActiveStation() {
        List<Station> stations = stationRepository.findOpenStationsWithAvailableVehicles();
        return stations
            .stream()
            .map(station ->
                new StationResponse(
                    station.getStationName(),
                    station.getAddress(),
                    station.getOpeningHours()
                )
            )
            .toList();
    }

    @Override
    public MyStationResponse getCurrentStaffStation(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("Không tìm thấy người dùng: " + username);
        }
        // Cho phép STAFF và ADMIN theo rule Security
        if (!"STAFF".equals(user.getRole().toString()) && !"ADMIN".equals(user.getRole().toString())) {
            throw new BusinessException("User không có quyền xem trạm: " + username);
        }

        Station station = user.getStation();
        if (station == null) {
            throw new ResourceNotFoundException("Không tìm thấy trạm của nhân viên: " + username);
        }

        // Lấy danh sách xe theo station và map sang short response + status
        var vehicles = vehicleRepository.findByStation_StationId(station.getStationId())
                .stream()
                .map(vehicleMapper::toShortVehicleResponse)
                .toList();

        return MyStationResponse.builder()
                .stationName(station.getStationName())
                .address(station.getAddress())
                .openingHours(station.getOpeningHours())
                .vehicles(vehicles)
                .build();
    }
    @Override
    @Transactional
    public StationResponse createStation(StationCreateRequest request) {
        // Kiểm tra trùng tên trạm
        if (stationRepository.findByStationName(request.getStationName()) != null) {
            throw new BusinessException("Tên trạm đã tồn tại: " + request.getStationName());
        }

        Station station = Station.builder()
                .stationName(request.getStationName())
                .address(request.getAddress())
                .openingHours(request.getOpeningHours())
                .status(StationStatus.fromString("OPEN"))// Mặc định OPEN khi tạo mới
                .build();

        Station savedStation = stationRepository.save(station);
        return stationMapper.toStationResponse(savedStation);
    }

    @Override
    @Transactional
    public StationUpdateResponse updateStation(Long stationId, StationUpdateRequest request) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + stationId));

        boolean isUpdated = false;

        // Update stationName
        if (request.getStationName() != null && !request.getStationName().isBlank()) {
            if (!station.getStationName().equals(request.getStationName())) {
                // Kiểm tra trùng tên
                Station existingStation = stationRepository.findByStationName(request.getStationName());
                if (existingStation != null && !existingStation.getStationId().equals(stationId)) {
                    throw new BusinessException("Tên trạm đã tồn tại: " + request.getStationName());
                }
                station.setStationName(request.getStationName());
                isUpdated = true;
            }
        }

        // Update address
        if (request.getAddress() != null && !request.getAddress().isBlank()) {
            if (!station.getAddress().equals(request.getAddress())) {
                station.setAddress(request.getAddress());
                isUpdated = true;
            }
        }

        // Update openingHours
        if (request.getOpeningHours() != null && !request.getOpeningHours().isBlank()) {
            if (!station.getOpeningHours().equals(request.getOpeningHours())) {
                station.setOpeningHours(request.getOpeningHours());
                isUpdated = true;
            }
        }

        // Update status
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            if (!station.getStatus().toString().equals(request.getStatus())) {
                station.setStatus(StationStatus.fromString(request.getStatus()));
                isUpdated = true;
            }
        }

        if (!isUpdated) {
            throw new BusinessException("Không có thông tin nào được thay đổi");
        }

        Station updatedStation = stationRepository.save(station);
        return stationMapper.toStationUpdateResponse(updatedStation);
    }
    @Override
    @Transactional
    public void deleteStation(Long stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + stationId));


        if ("CLOSED".equals(station.getStatus().toString())) {
            throw new BusinessException("Trạm này đã bị đóng trước đó");
        }


        station.setStatus(StationStatus.fromString("CLOSED"));
        stationRepository.save(station);
    }

    @Override
    public StationVehicleStatsResponse getStationVehicleStats(Long stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + stationId));

        List<Vehicle> allVehicles = vehicleRepository.findByStation_StationId(stationId);

        List<VehicleResponse> availableList = allVehicles.stream()
                .filter(v -> "AVAILABLE".equals(v.getStatus().toString()))
                .map(vehicleMapper::toShortVehicleResponse)
                .toList();

        List<VehicleResponse> inUseList = allVehicles.stream()
                .filter(v -> "IN_USE".equals(v.getStatus().toString()))
                .map(vehicleMapper::toShortVehicleResponse)
                .toList();

        List<VehicleResponse> maintenanceList = allVehicles.stream()
                .filter(v -> "MAINTENANCE".equals(v.getStatus().toString()))
                .map(vehicleMapper::toShortVehicleResponse)
                .toList();

        return StationVehicleStatsResponse.builder()
                .stationId(station.getStationId())
                .stationName(station.getStationName())
                .totalVehicles(allVehicles.size())
                .availableVehicles(availableList.size())
                .inUseVehicles(inUseList.size())
                .maintenanceVehicles(maintenanceList.size())
                .availableVehicleList(availableList)
                .inUseVehicleList(inUseList)
                .maintenanceVehicleList(maintenanceList)
                .build();
    }

}
