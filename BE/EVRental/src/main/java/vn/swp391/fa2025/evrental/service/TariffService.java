package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.request.TariffCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.TariffUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;

import java.util.List;

public interface TariffService {
    List<TariffResponse> showAllTariffs();
    TariffResponse getTariffById(Long id);
    List<TariffResponse> getTariffsByModelId(Long modelId);
    TariffResponse createTariff(TariffCreateRequest request);
    TariffResponse updateTariff(Long id, TariffUpdateRequest request);
    void deleteTariff(Long id);
}