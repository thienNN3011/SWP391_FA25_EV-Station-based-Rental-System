package vn.swp391.fa2025.evrental.dto.response;

/**
 * Generic wrapper class cho tất cả API responses
 * Chuẩn hóa format: code, success, message, data
 */
public class ApiResponse <T>{
    private int code;           // HTTP status code (200, 400, 404, 500...)
    private boolean success;    // true = thành công, false = thất bại
    private String message;     // Thông báo cho user
    private T data;             // Dữ liệu thực tế (generic type)

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }
}
