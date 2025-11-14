package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import vn.swp391.fa2025.evrental.dto.request.VehicleCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.VehicleUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.*;
import vn.swp391.fa2025.evrental.entity.*;
import vn.swp391.fa2025.evrental.enums.BookingStatus;
import vn.swp391.fa2025.evrental.enums.StationStatus;
import vn.swp391.fa2025.evrental.enums.VehicleStatus;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.mapper.StationMapper;
import vn.swp391.fa2025.evrental.mapper.VehicleMapper;
import vn.swp391.fa2025.evrental.repository.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
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

    @Autowired
    private StationMapper stationMapper;

    @Autowired
    private BookingRepository bookingRepository;


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

        if (!"OPEN".equals(station.getStatus().toString())) {
            throw new BusinessException("Trạm hiện không hoạt động");
        }

        if (vehicleRepository.findByPlateNumber(request.getPlateNumber()).isPresent()) {
            throw new BusinessException("Biển số xe đã tồn tại: " + request.getPlateNumber());
        }


        Set<String> availableColors = model.getImageUrls().stream()
                .map(ModelImageUrl::getColor)
                .collect(Collectors.toSet());

        if (availableColors.isEmpty()) {
            throw new BusinessException("Model xe chưa có danh sách màu khả dụng");
        }

        if (!availableColors.contains(request.getColor())) {
            throw new BusinessException("Màu '" + request.getColor() +
                    "' không có sẵn cho model xe này. Các màu khả dụng: " +
                    String.join(", ", availableColors));
        }

        Vehicle vehicle = vehicleMapper.toVehicleFromCreateRequest(request);
        vehicle.setModel(model);
        vehicle.setStation(station);
        vehicle.setStatus(VehicleStatus.fromString("AVAILABLE"));

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toVehicleResponse(savedVehicle);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleUpdateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy xe với ID: " + id));

        boolean isUpdated = false;

        // Nếu thay đổi model, cần validate lại màu
        VehicleModel targetModel = vehicle.getModel();
        if (request.getModelId() != null) {
            if (!vehicle.getModel().getModelId().equals(request.getModelId())) {
                targetModel = vehicleModelRepository.findById(request.getModelId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + request.getModelId()));
                vehicle.setModel(targetModel);
                isUpdated = true;
            }
        }


        if (request.getColor() != null && !request.getColor().isBlank()) {
            if (!vehicle.getColor().equals(request.getColor()) || isUpdated) {

                Set<String> availableColors = targetModel.getImageUrls().stream()
                        .map(ModelImageUrl::getColor)
                        .collect(Collectors.toSet());

                if (availableColors.isEmpty()) {
                    throw new BusinessException("Model xe chưa có danh sách màu khả dụng");
                }

                if (!availableColors.contains(request.getColor())) {
                    throw new BusinessException("Màu '" + request.getColor() +
                            "' không có sẵn cho model xe này. Các màu khả dụng: " +
                            String.join(", ", availableColors));
                }

                vehicle.setColor(request.getColor());
                isUpdated = true;
            }
        }


        if (request.getStationId() != null) {
            if (!vehicle.getStation().getStationId().equals(request.getStationId())) {
                Station station = stationRepository.findById(request.getStationId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trạm với ID: " + request.getStationId()));

                if (!"OPEN".equals(station.getStatus().toString())) {
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

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            if (!vehicle.getStatus().toString().equals(request.getStatus())) {
                vehicle.setStatus(VehicleStatus.fromString(request.getStatus()));
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

        if ("INACTIVE".equals(vehicle.getStatus().toString())) {
            throw new BusinessException("Xe đã ở trạng thái INACTIVE");
        }


        if ("IN_USE".equalsIgnoreCase(vehicle.getStatus().toString())) {
            throw new BusinessException("Không thể xóa xe đang được sử dụng");
        }

        vehicle.setStatus(VehicleStatus.fromString("INACTIVE"));
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
        else vehicles=vehicleRepository.findByStation_StationIdAndStatus(staff.getStation().getStationId(), VehicleStatus.fromString(status));
        return vehicleMapper.toShortVehicleResponseList(vehicles);
    }


    public List<ActiveVehicleResponse> getActiveVehiclesByStation(String stationName) {

        Station station = stationRepository.findByStationName(stationName);
        if (station == null) {
            throw new ResourceNotFoundException("Không tìm thấy trạm: " + stationName);
        }
        if (!"OPEN".equals(station.getStatus().toString())) {
            throw new BusinessException("Trạm hiện không hoạt động");
        }


        List<Vehicle> vehicles = vehicleRepository.findByStation_StationNameAndStatus(
                stationName,
                VehicleStatus.fromString("AVAILABLE")
        );


        return vehicles.stream()
                .map(vehicle -> {

                    ActiveVehicleResponse response = vehicleMapper.toActiveVehicleResponse(vehicle);


                    List<TariffResponse> activeTariffs = vehicle.getModel().getTariffs().stream()
                            .filter(t -> "active".equalsIgnoreCase(t.getStatus().toString()))
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

    @Override
    public void changeVehicleStation(Long vehicleId, String stationName) {
        Station station = stationRepository.findByStationName(stationName);
        if (station == null) throw new RuntimeException("Station không tồn tại");
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle không tồn tại"));
        vehicle.setStation(station);
        vehicleRepository.save(vehicle);
    }

    @Override
    public ChangeVehicleStationResponse showVehicleInStation(String stationName, Long modelId) {
        Station currentStation = stationRepository.findByStationName(stationName);
        if (currentStation == null) {
            throw new RuntimeException("Station không tồn tại: " + stationName);
        }
        List<VehicleResponse> vehicles= vehicleMapper.toListShortResponse(vehicleRepository.findByStation_StationNameAndModel_ModelIdAndStatus(stationName, modelId, VehicleStatus.fromString("AVAILABLE")));
        List<StationResponse> activeStations = stationMapper.toStationResponseList(
                stationRepository.findByStatus(StationStatus.fromString("OPEN"))
                        .stream()
                        .filter(station -> !(station.getStationId() == currentStation.getStationId()))
                        .toList()
        );

        ChangeVehicleStationResponse response= ChangeVehicleStationResponse.builder()
                .stationList(activeStations)
                .vehicleList(vehicles)
                .build();
        return response;
    }


    @Override
    public List<VehicleResponse> getVehicleToUpdate(Long bookingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String staffname = authentication.getName();
        User staff= userRepository.findByUsername(staffname);
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking không tồn tại"));
        if (booking.getVehicle().getStation().getStationId()!=staff.getStation().getStationId()) throw new RuntimeException("Booking này không thuộc trạm của bạn!Booking thuộc trạm"+ booking.getVehicle().getStation().getStationName());
        if (booking.getStatus()!= BookingStatus.BOOKING) throw new RuntimeException("Booking không ở trạng thái BOOKING");
        List<Vehicle> vehicles= vehicleRepository.findByStation_StationNameAndModel_ModelIdAndStatus(booking.getVehicle().getStation().getStationName(), booking.getVehicle().getModel().getModelId(), VehicleStatus.AVAILABLE);
        String color= booking.getVehicle().getColor();
        vehicles = vehicles.stream()
                .filter(v -> !v.getVehicleId().equals(booking.getVehicle().getVehicleId()))
                .sorted(Comparator.comparing(
                        (Vehicle v) -> !v.getColor().equalsIgnoreCase(color)
                ))
                .toList();
        return vehicleMapper.toListVehicleResponse(vehicles);
    }
}