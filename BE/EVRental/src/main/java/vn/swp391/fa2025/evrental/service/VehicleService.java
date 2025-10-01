package vn.swp391.fa2025.evrental.service;

import org.springframework.stereotype.Service;
import vn.swp391.fa2025.evrental.entity.Vehicle;

import java.util.List;

@Service
public interface VehicleService {
    public List<Vehicle> showAllVehicle();
}
