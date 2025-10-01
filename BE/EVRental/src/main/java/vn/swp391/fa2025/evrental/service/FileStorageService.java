package vn.swp391.fa2025.evrental.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${app.upload-dir}")
    private String uploadDir;

    public String saveImage(MultipartFile file, String prefix){
        if(file == null || file.isEmpty()){
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }
        String contentType = file.getContentType();
        if(contentType == null || !contentType.startsWith("image/")){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is not image");
        }
        String ext = contentType.equals("image/png") ? ".png" : ".jpg";
        String filename = prefix + "_" + UUID.randomUUID().toString() + ext;

        try{
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if(!Files.exists(uploadPath)){
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(filename).normalize();
            file.transferTo(filePath);
            return "data/image/" + filename;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not save file: " + e.getMessage());
        }

    }

}

