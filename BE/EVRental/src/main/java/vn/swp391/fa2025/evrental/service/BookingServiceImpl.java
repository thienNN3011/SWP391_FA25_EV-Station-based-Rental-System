package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.request.BookingRequest;
import vn.swp391.fa2025.evrental.dto.response.BookingResponse;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.VehicleResponse;
import vn.swp391.fa2025.evrental.entity.Booking;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.entity.Tariff;
import vn.swp391.fa2025.evrental.entity.Vehicle;
import vn.swp391.fa2025.evrental.repository.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class BookingServiceImpl implements  BookingService{
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private TariffRepository tariffRepository;
    @Autowired
    private StationRepository stationRepository;
    @Override
    public BookingResponse bookVehicle(BookingRequest bookingRequest) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        String username = authentication.getName();
//        String role = authentication.getAuthorities()
//                .stream()
//                .findFirst()
//                .map(a -> a.getAuthority())
//                .orElse(null);
//        if (!role.equals("RENTER")) throw new RuntimeException("Chỉ người dùng mới có thể đặt xe");

        Booking booking = new Booking();
        booking.setUser(userRepository.findByUsername(bookingRequest.getUsername()));
        Station station= stationRepository.findByStationName(bookingRequest.getStationName());
        if (station==null || !station.getStatus().equals("OPEN")) throw new RuntimeException("Trạm không tồn tại hoặc hiện tại không khả dụng");
        List<Vehicle> vehicles = vehicleRepository.findByStation_StationIdAndModel_ModelIdAndColor(station.getStationId(),bookingRequest.getModelId(), bookingRequest.getColor());
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getStatus().equals("AVAILABLE")) {
                vehicle.setStatus("BOOKED");
                booking.setVehicle(vehicle);
                break;
            }
        }
        if (booking.getVehicle()==null) {
            throw new RuntimeException("Hiện tại không có xe nào khả dụng cho mẫu xe này");
        }
        if (bookingRequest.getStartTime().isBefore(LocalDateTime.now())) throw new RuntimeException("Thời gian bắt đầu phải sau thời gian hiện tại");
        booking.setStartTime(bookingRequest.getStartTime());
        if (bookingRequest.getEndTime().isBefore(booking.getStartTime())) throw new RuntimeException("Thời gian kết thúc phải sau thời gian bắt đầu");
        booking.setEndTime(bookingRequest.getEndTime());
        if (tariffRepository.findById(bookingRequest.getTariffId()).isEmpty()) throw new RuntimeException("TariffId không hợp lệ");
        if (tariffRepository.findByTariffIdAndModel_ModelId(bookingRequest.getTariffId(), bookingRequest.getModelId())==null) throw new RuntimeException("Tariff không phù hợp với Model hiện tại");
        if (tariffRepository.findById(bookingRequest.getTariffId()).get().getStatus().equals("INACTIVE")) throw new RuntimeException("Tariff hiện tại không khả dụng");
        booking.setTariffId(bookingRequest.getTariffId());
        booking.setCreatedDate(LocalDateTime.now());
        booking.setStatus("BOOKING");
        booking.setTotalAmount((Double) 0.0);
        if (bookingRepository.save(booking)!=null) {
            Vehicle vehicle= booking.getVehicle();
            vehicle.setStatus("BOOKED");
            vehicleRepository.save(vehicle);
            Tariff tariff= tariffRepository.findById(bookingRequest.getTariffId()).get();
            tariff.setNumberOfContractAppling(tariff.getNumberOfContractAppling()+1);
            tariffRepository.save(tariff);
        }
        VehicleResponse vehicleResponse= new VehicleResponse(
                booking.getVehicle().getPlateNumber(),
                booking.getVehicle().getColor(),
                booking.getVehicle().getModel().getName(),
                booking.getVehicle().getModel().getBrand()
        );
        StationResponse stationResponse= new StationResponse(
                station.getStationName(),
                station.getAddress(),
                station.getOpeningHours()
        );

        Tariff tariff= tariffRepository.findById(bookingRequest.getTariffId()).get();
        TariffResponse tariffResponse= new TariffResponse(
                tariff.getTariffId(),
                tariff.getType(),
                tariff.getPrice(),
                tariff.getDepositAmount()
        );

        BookingResponse bookingResponse= BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .username(bookingRequest.getUsername())
                .vehicle(vehicleResponse)
                .station(stationResponse)
                .tariff(tariffResponse)
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .build();
        return bookingResponse;
    }
}
