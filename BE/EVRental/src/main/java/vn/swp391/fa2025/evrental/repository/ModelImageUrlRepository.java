package vn.swp391.fa2025.evrental.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.swp391.fa2025.evrental.entity.ModelImageUrl;

import java.util.List;

@Repository
public interface ModelImageUrlRepository extends JpaRepository<ModelImageUrl, Long> {
    List<ModelImageUrl> findByModel_ModelId(Long modelId);

    void deleteByModel_ModelId(Long modelId);
}