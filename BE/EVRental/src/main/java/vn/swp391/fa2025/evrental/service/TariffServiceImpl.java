package vn.swp391.fa2025.evrental.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import vn.swp391.fa2025.evrental.dto.request.TariffCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.TariffUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.entity.Tariff;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.mapper.TariffMapper;
import vn.swp391.fa2025.evrental.repository.TariffRepository;
import vn.swp391.fa2025.evrental.repository.VehicleModelRepository;
import vn.swp391.fa2025.evrental.service.TariffService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Validated
public class TariffServiceImpl implements TariffService {

    @Autowired
    private TariffRepository tariffRepository;

    @Autowired
    private VehicleModelRepository vehicleModelRepository;

    @Autowired
    private TariffMapper tariffMapper;

    @Override
    public List<TariffResponse> showAllTariffs() {
        return tariffRepository.findAll().stream()
                .map(tariffMapper::toTariffResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TariffResponse getTariffById(Long id) {
        Tariff tariff = tariffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bảng giá với ID: " + id));
        return tariffMapper.toTariffResponse(tariff);
    }

    @Override
    public List<TariffResponse> getTariffsByModelId(Long modelId) {
        VehicleModel model = vehicleModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu xe với ID: " + modelId));

        return tariffRepository.findByModel_ModelId(modelId).stream()
                .map(tariffMapper::toTariffResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TariffResponse createTariff(TariffCreateRequest request) {
        VehicleModel model = vehicleModelRepository.findById(request.getModelId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu xe với ID: " + request.getModelId()));

        // Kiểm tra xem đã có tariff với type này cho model này chưa
        if (tariffRepository.existsByModel_ModelIdAndType(request.getModelId(), request.getType())) {
            throw new BusinessException("Bảng giá loại '" + request.getType() +
                    "' cho mẫu xe này đã tồn tại");
        }

        Tariff tariff = tariffMapper.toTariffFromCreateRequest(request);
        tariff.setModel(model);

        // Set default status if not provided
        if (tariff.getStatus() == null || tariff.getStatus().isBlank()) {
            tariff.setStatus("ACTIVE");
        }

        Tariff savedTariff = tariffRepository.save(tariff);
        return tariffMapper.toTariffResponse(savedTariff);
    }

    @Override
    @Transactional
    public TariffResponse updateTariff(Long id, TariffUpdateRequest request) {
        Tariff tariff = tariffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bảng giá với ID: " + id));

        boolean isUpdated = false;

        if (request.getModelId() != null) {
            if (!tariff.getModel().getModelId().equals(request.getModelId())) {
                VehicleModel model = vehicleModelRepository.findById(request.getModelId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu xe với ID: " + request.getModelId()));
                tariff.setModel(model);
                isUpdated = true;
            }
        }

        if (request.getType() != null && !request.getType().isBlank()) {
            if (!tariff.getType().equals(request.getType())) {
                // Kiểm tra type mới có trùng không
                if (tariffRepository.existsByModel_ModelIdAndType(tariff.getModel().getModelId(), request.getType())) {
                    throw new BusinessException("Bảng giá loại '" + request.getType() +
                            "' cho mẫu xe này đã tồn tại");
                }
                tariff.setType(request.getType());
                isUpdated = true;
            }
        }

        if (request.getPrice() != null) {
            if (tariff.getPrice().compareTo(request.getPrice()) != 0) {
                tariff.setPrice(request.getPrice());
                isUpdated = true;
            }
        }

        if (request.getNumberOfContractAppling() != null) {
            if (!tariff.getNumberOfContractAppling().equals(request.getNumberOfContractAppling())) {
                tariff.setNumberOfContractAppling(request.getNumberOfContractAppling());
                isUpdated = true;
            }
        }

        if (request.getDepositAmount() != null) {
            if (tariff.getDepositAmount().compareTo(request.getDepositAmount()) != 0) {
                tariff.setDepositAmount(request.getDepositAmount());
                isUpdated = true;
            }
        }

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
        return tariffMapper.toTariffResponse(updatedTariff);
    }

    @Override
    @Transactional
    public void deleteTariff(Long id) {
        Tariff tariff = tariffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bảng giá với ID: " + id));

        // Kiểm tra xem có booking nào đang sử dụng tariff này không
        if (tariff.getBookings() != null && !tariff.getBookings().isEmpty()) {
            throw new BusinessException("Không thể xóa bảng giá đang có " +
                    tariff.getBookings().size() + " booking liên kết");
        }

        // Soft delete: chuyển status sang INACTIVE
        tariff.setStatus("INACTIVE");
        tariffRepository.save(tariff);
    }
}