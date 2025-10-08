package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.entity.Station;
import vn.swp391.fa2025.evrental.repository.StationRepository;

import java.util.List;

@Service
public class StationServiceImpl implements StationService {
    @Autowired
    private StationRepository stationRepository;

    @Override
    public List<StationResponse> showActiveStation() {
        List<Station> stations = stationRepository.findByStatus("OPEN");
        return stations.stream().map(station -> new StationResponse(
                station.getStationName(),
                station.getAddress(),
                station.getOpeningHours()
        )).toList();
    }
}
