package vn.swp391.fa2025.evrental.service;

import vn.swp391.fa2025.evrental.dto.request.TariffCreateRequest;
import vn.swp391.fa2025.evrental.dto.request.TariffUpdateRequest;
import vn.swp391.fa2025.evrental.dto.response.TariffResponse;
<<<<<<< HEAD
import vn.swp391.fa2025.evrental.dto.response.TariffUpdateResponse;
=======
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f

import java.util.List;

public interface TariffService {
<<<<<<< HEAD
    List<TariffResponse> showAllTariff();
    TariffResponse getTariffById(Long id);
    TariffResponse createTariff(TariffCreateRequest request);
    TariffUpdateResponse updateTariff(Long id, TariffUpdateRequest request);
=======
    List<TariffResponse> showAllTariffs();
    TariffResponse getTariffById(Long id);
    List<TariffResponse> getTariffsByModelId(Long modelId);
    TariffResponse createTariff(TariffCreateRequest request);
    TariffResponse updateTariff(Long id, TariffUpdateRequest request);
>>>>>>> cbb589721694ca5ce33df740b71da07f71ba805f
    void deleteTariff(Long id);
}