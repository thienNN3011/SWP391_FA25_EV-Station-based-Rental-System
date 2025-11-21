package vn.swp391.fa2025.evrental.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import vn.swp391.fa2025.evrental.dto.response.ApiResponse;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation errors for @Valid annotations
     * @param ex MethodArgumentNotValidException
     * @return ResponseEntity with validation error details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(fieldError -> {
            String fieldName = fieldError.getField();
            String errorMessage = fieldError.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse> handleException(RuntimeException ex){
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setSuccess(Boolean.FALSE);
        apiResponse.setMessage(ex.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleInvalidFormat(HttpMessageNotReadableException ex) {
        Map<String, String> errors = new HashMap<>();
        Throwable cause = ex.getCause();
        if (cause instanceof com.fasterxml.jackson.databind.exc.InvalidFormatException invalidEx) {
            String field = invalidEx.getPath().get(0).getFieldName();
            String value = invalidEx.getValue().toString();
            String targetType = invalidEx.getTargetType().getSimpleName();
            errors.put(field, "Giá trị '" + value + "' không đúng kiểu " + targetType);
            return ResponseEntity.badRequest().body(errors);
        }
        errors.put("error", "JSON không hợp lệ hoặc sai định dạng.");
        return ResponseEntity.badRequest().body(errors);
    }
}
