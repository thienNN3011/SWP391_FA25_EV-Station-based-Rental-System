package vn.swp391.fa2025.evrental.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.swp391.fa2025.evrental.dto.request.AddModelImageRequest;
import vn.swp391.fa2025.evrental.dto.response.ModelImageUrlResponse;
import vn.swp391.fa2025.evrental.entity.ModelImageUrl;
import vn.swp391.fa2025.evrental.entity.VehicleModel;
import vn.swp391.fa2025.evrental.exception.BusinessException;
import vn.swp391.fa2025.evrental.exception.ResourceNotFoundException;
import vn.swp391.fa2025.evrental.mapper.ModelImageUrlMapper;
import vn.swp391.fa2025.evrental.repository.ModelImageUrlRepository;
import vn.swp391.fa2025.evrental.repository.VehicleModelRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelImageUrlService {

    private final ModelImageUrlRepository imageRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final FileStorageService fileStorageService;
    private final ModelImageUrlMapper imageMapper;


    public List<ModelImageUrlResponse> getImagesByModelId(Long modelId) {
        if (!vehicleModelRepository.existsById(modelId)) {
            throw new ResourceNotFoundException("Không tìm thấy model xe với ID: " + modelId);
        }

        List<ModelImageUrl> images = imageRepository.findByModel_ModelId(modelId);
        return imageMapper.toResponseList(images);
    }


    @Transactional
    public ModelImageUrlResponse addImageToModel(Long modelId, AddModelImageRequest request) {
        // Kiểm tra model tồn tại
        VehicleModel model = vehicleModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy model xe với ID: " + modelId));

        // Kiểm tra màu đã tồn tại chưa
        if (imageRepository.existsByModel_ModelIdAndColor(modelId, request.getColor())) {
            throw new BusinessException("Màu '" + request.getColor() + "' đã tồn tại cho model này");
        }

        // Lưu file ảnh
        String imagePath = fileStorageService.saveImage(request.getImage(), "vehiclemodel");

        // Tạo entity
        ModelImageUrl imageUrl = ModelImageUrl.builder()
                .imageUrl(imagePath)
                .color(request.getColor())
                .model(model)
                .build();

        // Lưu vào database
        ModelImageUrl savedImage = imageRepository.save(imageUrl);

        return imageMapper.toResponse(savedImage);
    }


    @Transactional
    public void deleteImage(Long imageId) {
        ModelImageUrl image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ảnh với ID: " + imageId));

        // Kiểm tra model phải có ít nhất 2 ảnh (để đảm bảo luôn có ít nhất 1 ảnh)
        long imageCount = imageRepository.countByModel_ModelId(image.getModel().getModelId());
        if (imageCount <= 1) {
            throw new BusinessException("Không thể xóa ảnh cuối cùng của model");
        }

        // Xóa file ảnh (optional - tùy logic của bạn)
        // fileStorageService.deleteImage(image.getImageUrl());

        // Xóa record
        imageRepository.delete(image);
    }


    @Transactional
    public void deleteImageFromModel(Long modelId, Long imageId) {
        ModelImageUrl image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ảnh với ID: " + imageId));

        // Kiểm tra ảnh có thuộc model không
        if (!image.getModel().getModelId().equals(modelId)) {
            throw new BusinessException("Ảnh không thuộc model này");
        }

        // Kiểm tra số lượng ảnh
        long imageCount = imageRepository.countByModel_ModelId(modelId);
        if (imageCount <= 1) {
            throw new BusinessException("Không thể xóa ảnh cuối cùng của model");
        }

        imageRepository.delete(image);
    }


    @Transactional
    public ModelImageUrlResponse updateImage(Long imageId, MultipartFile newImage, String newColor) {
        ModelImageUrl image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ảnh với ID: " + imageId));

        boolean isUpdated = false;

        // Cập nhật màu nếu có thay đổi
        if (newColor != null && !newColor.isBlank() && !image.getColor().equals(newColor)) {
            // Kiểm tra màu mới có bị trùng không
            if (imageRepository.existsByModel_ModelIdAndColor(image.getModel().getModelId(), newColor)) {
                throw new BusinessException("Màu '" + newColor + "' đã tồn tại cho model này");
            }
            image.setColor(newColor);
            isUpdated = true;
        }

        // Cập nhật file ảnh nếu có
        if (newImage != null && !newImage.isEmpty()) {
            String imagePath = fileStorageService.saveImage(newImage, "vehiclemodel");
            image.setImageUrl(imagePath);
            isUpdated = true;
        }

        if (!isUpdated) {
            throw new BusinessException("Không có thông tin nào được thay đổi");
        }

        ModelImageUrl updatedImage = imageRepository.save(image);
        return imageMapper.toResponse(updatedImage);
    }
}