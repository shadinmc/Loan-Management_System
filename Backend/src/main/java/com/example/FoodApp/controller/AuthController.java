package com.example.FoodApp.controller;



import com.example.FoodApp.dto.LoginRequest;
import com.example.FoodApp.dto.LoginResponse;
import com.example.FoodApp.dto.SignupRequest;
import com.example.FoodApp.model.User;
import com.example.FoodApp.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // CUSTOMER SIGNUP
    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequest request) {
        return authService.registerUser(request);
    }

    // ADMIN SIGNUP
    @PostMapping("/admin/signup")
    public User adminSignup(@RequestBody SignupRequest request) {
        return authService.registerAdmin(request);
    }

    // LOGIN
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}

