package vn.swp391.fa2025.evrental.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.dto.response.MyStationResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.User;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
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

    @Override
    public List<StationResponse> showActiveStation() {
        List<Station> stations = stationRepository.findByStatus("OPEN");
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
        if (!"STAFF".equals(user.getRole()) && !"ADMIN".equals(user.getRole())) {
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
}
