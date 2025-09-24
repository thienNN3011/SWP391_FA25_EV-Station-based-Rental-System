package com.daiduong.basic.evrental.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
class HelloController {

    @GetMapping("/hello")
    public String hello(){
        return "Hello EVRental System";
    }

    @RequestMapping("/")
    public String home(){
        return "Hello EVRental API is running";
    }
}
