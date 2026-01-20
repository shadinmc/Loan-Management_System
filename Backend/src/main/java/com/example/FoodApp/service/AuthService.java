package com.example.FoodApp.service;
import com.example.FoodApp.dto.LoginRequest;
import com.example.FoodApp.dto.LoginResponse;
import com.example.FoodApp.dto.SignupRequest;
import com.example.FoodApp.enums.Role;
import com.example.FoodApp.model.User;
import com.example.FoodApp.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // CUSTOMER SIGNUP
    public User registerUser(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setRole(Role.CUSTOMER);

        return userRepository.save(user);
    }

    // ADMIN SIGNUP
    public User registerAdmin(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User admin = new User();
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setName(request.getName());
        admin.setPhoneNumber(request.getPhoneNumber());
        admin.setAddress(request.getAddress());
        admin.setRole(Role.ADMIN);

        return userRepository.save(admin);
    }

    // LOGIN
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        LoginResponse response = new LoginResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());


        return response;
    }


}

