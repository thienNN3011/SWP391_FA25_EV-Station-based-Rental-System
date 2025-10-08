package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.dto.response.StationResponse;
import vn.swp391.fa2025.evrental.entity.Station;

import java.util.List;

@Service
public interface StationService {
    public List<StationResponse> showActiveStation();
}
