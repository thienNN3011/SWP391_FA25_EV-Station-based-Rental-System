package com.daiduong.basic.evrental.dto.request;

import lombok.Data;

/**
 * Data Transfer Object for login request containing user credentials
 */
@Data
public class LoginRequest {

    private String username;
    private String password;
}
