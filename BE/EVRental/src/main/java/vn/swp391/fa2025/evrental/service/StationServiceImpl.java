package vn.swp391.fa2025.evrental.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.StationCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.StationUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.dto.response.MyStationResponse;
<<<<<<< HEAD
import vn.swp391.fa2025.evrental.dto.response.StationUpdateResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
=======
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.User;
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

<<<<<<< HEAD

=======
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
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
<<<<<<< HEAD
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
                .status("OPEN") // Mặc định OPEN khi tạo mới
                .build();
=======

    @Override
    @Transactional
    public StationResponse getStationById(Long id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + id));

        return stationMapper.toStationResponse(station);
    }

    @Override
    public StationResponse createStation(StationCreateRequest request) {
        if (stationRepository.existsByStationName(request.getStationName())) {
            throw new BusinessException("Tên trạm '" + request.getStationName() + "' đã tồn tại");
        }

        Station station = stationMapper.toStationFromCreateRequest(request);

        // Set default status if not provided
        if (station.getStatus() == null || station.getStatus().isBlank()) {
            station.setStatus("OPEN");
        }
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f

        Station savedStation = stationRepository.save(station);
        return stationMapper.toStationResponse(savedStation);
    }
<<<<<<< HEAD

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
=======
    @Override
    @Transactional
    public StationResponse updateStation(Long id, StationUpdateRequest request) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + id));

        boolean isUpdated = false;

        if (request.getStationName() != null && !request.getStationName().isBlank()) {
            if (!station.getStationName().equals(request.getStationName())) {
                // Kiểm tra tên mới có trùng với trạm khác không
                if (stationRepository.existsByStationName(request.getStationName())) {
                    throw new BusinessException("Tên trạm '" + request.getStationName() + "' đã tồn tại");
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
                }
                station.setStationName(request.getStationName());
                isUpdated = true;
            }
        }

<<<<<<< HEAD
        // Update address
=======
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        if (request.getAddress() != null && !request.getAddress().isBlank()) {
            if (!station.getAddress().equals(request.getAddress())) {
                station.setAddress(request.getAddress());
                isUpdated = true;
            }
        }

<<<<<<< HEAD
        // Update openingHours
=======
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        if (request.getOpeningHours() != null && !request.getOpeningHours().isBlank()) {
            if (!station.getOpeningHours().equals(request.getOpeningHours())) {
                station.setOpeningHours(request.getOpeningHours());
                isUpdated = true;
            }
        }

<<<<<<< HEAD
        // Update status
=======
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            if (!station.getStatus().equals(request.getStatus())) {
                station.setStatus(request.getStatus());
                isUpdated = true;
            }
        }

        if (!isUpdated) {
            throw new BusinessException("Không có thông tin nào được thay đổi");
        }

        Station updatedStation = stationRepository.save(station);
<<<<<<< HEAD
        return stationMapper.toStationUpdateResponse(updatedStation);
    }
    @Override
    @Transactional
    public void deleteStation(Long stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + stationId));


        if ("CLOSED".equals(station.getStatus())) {
            throw new BusinessException("Trạm này đã bị đóng trước đó");
        }


=======
        return stationMapper.toStationResponse(updatedStation);
    }

    @Override
    @Transactional
    public void deleteStation(Long id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + id));

        // Kiểm tra có xe nào đang thuộc trạm này không
        if (station.getVehicles() != null && !station.getVehicles().isEmpty()) {
            throw new BusinessException("Không thể xóa trạm đang có " +
                    station.getVehicles().size() + " xe");
        }

        // Kiểm tra có nhân viên nào đang thuộc trạm này không
        if (station.getUsers() != null && !station.getUsers().isEmpty()) {
            throw new BusinessException("Không thể xóa trạm đang có " +
                    station.getUsers().size() + " nhân viên");
        }

        // Soft delete: chuyển trạng thái thành CLOSED
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
        station.setStatus("CLOSED");
        stationRepository.save(station);
    }
}
