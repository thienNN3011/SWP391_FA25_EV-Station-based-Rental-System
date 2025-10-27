package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.request.TariffCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.TariffUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
import vn.swp391.fa2025.evrental.dto.response.TariffUpdateResponse;

import java.util.List;

public interface TariffService {
    List<TariffResponse> showAllTariff();
    TariffResponse getTariffById(Long id);
    TariffResponse createTariff(TariffCreateRequest request);
    TariffUpdateResponse updateTariff(Long id, TariffUpdateRequest request);
    void deleteTariff(Long id);
}