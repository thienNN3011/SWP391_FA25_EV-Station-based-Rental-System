package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.ModelImageUrl;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelImageUrlRepository extends JpaRepository<ModelImageUrl, Long> {

    // Tìm tất cả ảnh của một model
    List<ModelImageUrl> findByModel_ModelId(Long modelId);

    // Tìm ảnh theo màu của model
    Optional<ModelImageUrl> findByModel_ModelIdAndColor(Long modelId, String color);

    // Kiểm tra màu đã tồn tại trong model chưa
    boolean existsByModel_ModelIdAndColor(Long modelId, String color);

    // Đếm số lượng ảnh của model
    long countByModel_ModelId(Long modelId);

    // Xóa tất cả ảnh của model (cascade sẽ xử lý nhưng có thể dùng khi cần)
    void deleteByModel_ModelId(Long modelId);
}