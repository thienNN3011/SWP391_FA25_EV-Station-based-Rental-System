package vn.swp391.fa2025.evrental.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Basic controller for testing endpoints
 */
@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello(){
        return "Hello EVRental System";
    }

    @RequestMapping("/")
    public String home(){
        return "Hello EVRental API is running";
    }
}
