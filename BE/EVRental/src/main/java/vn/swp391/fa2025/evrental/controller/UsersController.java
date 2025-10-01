package vn.swp391.fa2025.evrental.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.swp391.fa2025.evrental.dto.request.RegisterCustomerRequest;
import vn.swp391.fa2025.evrental.dto.response.CustomerResponse;
import vn.swp391.fa2025.evrental.service.RegistrationService;

import java.net.URI;

@RestController
public class UsersController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping(value = "/users", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomerResponse> createUser(@Valid @ModelAttribute RegisterCustomerRequest req) {
        CustomerResponse res = registrationService.registerCustomer(req);
        return ResponseEntity.created(URI.create("/users/" + res.getUserId())).body(res);
    }
}

