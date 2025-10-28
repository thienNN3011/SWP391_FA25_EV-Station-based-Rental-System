package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.swp391.fa2025.evrental.dto.request.TariffCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.TariffUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffUpdateResponse;
import vn.swp391.fa2025.evrental.entity.Tariff;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.mapper.TariffMapper;
import vn.swp391.fa2025.evrental.repository.TariffRepository;
import vn.swp391.fa2025.evrental.repository.VehicleModelRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TariffServiceImpl implements TariffService {

    @Autowired
    private TariffRepository tariffRepository;

    @Autowired
    private VehicleModelRepository vehicleModelRepository;

    @Autowired
    private TariffMapper tariffMapper;

    @Override
    public List<TariffResponse> showAllTariff() {
        return tariffRepository.findAll().stream()
                .map(tariffMapper::toTariffResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TariffResponse getTariffById(Long id) {
        Tariff tariff = tariffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tariff với ID: " + id));
        return tariffMapper.toTariffResponse(tariff);
    }

    @Override
    @Transactional
    public TariffResponse createTariff(TariffCreateRequest request) {

        VehicleModel model = vehicleModelRepository.findById(request.getModelId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + request.getModelId()));


        Tariff tariff = Tariff.builder()
                .model(model)
                .type(request.getType())
                .price(request.getPrice())
                .depositAmount(request.getDepositAmount())
                .numberOfContractAppling(0L)
                .status("ACTIVE")
                .build();

        Tariff savedTariff = tariffRepository.save(tariff);
        return tariffMapper.toTariffResponse(savedTariff);
    }

    @Override
    @Transactional
    public TariffUpdateResponse updateTariff(Long id, TariffUpdateRequest request) {
        Tariff tariff = tariffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tariff với ID: " + id));

        boolean isUpdated = false;

        // Update type
        if (request.getType() != null && !request.getType().isBlank()) {
            if (!tariff.getType().equals(request.getType())) {
                tariff.setType(request.getType());
                isUpdated = true;
            }
        }

        // Update price
        if (request.getPrice() != null) {
            if (!tariff.getPrice().equals(request.getPrice())) {
                tariff.setPrice(request.getPrice());
                isUpdated = true;
            }
        }

        // Update depositAmount
        if (request.getDepositAmount() != null) {
            if (!tariff.getDepositAmount().equals(request.getDepositAmount())) {
                tariff.setDepositAmount(request.getDepositAmount());
                isUpdated = true;
            }
        }

        // Update status
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            if (!tariff.getStatus().equals(request.getStatus())) {
                tariff.setStatus(request.getStatus());
                isUpdated = true;
            }
        }

        if (!isUpdated) {
            throw new BusinessException("Không có thông tin nào được thay đổi");
        }

        Tariff updatedTariff = tariffRepository.save(tariff);
        return tariffMapper.toTariffUpdateResponse(updatedTariff);
    }

    @Override
    @Transactional
    public void deleteTariff(Long id) {
        Tariff tariff = tariffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tariff với ID: " + id));


        if ("INACTIVE".equals(tariff.getStatus())) {
            throw new BusinessException("Tariff đã ở trạng thái INACTIVE");
        }


        if (tariff.getBookings() != null && !tariff.getBookings().isEmpty()) {
            throw new BusinessException("Không thể xóa tariff vì đang có booking sử dụng");
        }

        // Xóa mềm: chuyển status thành INACTIVE
        tariff.setStatus("INACTIVE");
        tariffRepository.save(tariff);
    }
}