package com.lms.auth.service;

import com.lms.audit.service.AuditService;
import com.lms.auth.dto.AuthResponse;
import com.lms.auth.dto.LoginRequest;
import com.lms.auth.dto.SignupRequest;
import com.lms.auth.security.JwtTokenProvider;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditService auditService;


    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }


        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setDateOfBirth(request.getDateOfBirth());

        //  auto age calculation
        user.calculateAge();

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);

//        User.Role role = User.Role.USER;
//        if (request.getRole() != null) {
//            try {
//                role = User.Role.valueOf(request.getRole().toUpperCase());
//            } catch (Exception ignored) {}
//        }
//
//        user.setRoles(Set.of(role));

        //added for testing purposes, in real app only admin can assign role during signup
        User.Role role;

        if (request.getRole() == null || request.getRole().isBlank()) {
            role = User.Role.USER; // default only if NOT provided
        } else {
            try {
                role = User.Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role: " + request.getRole());
            }
        }

        user.setRoles(Set.of(role));

        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(savedUser);
        auditService.log(
                savedUser.getId(),
                "USER_SIGNUP",
                "USER",
                savedUser.getId(),
                request,
                savedUser,
                201,
                true
        );


        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRoles(),
                "Signup successful"
        );
    }


    public AuthResponse login(LoginRequest request) {

        try {
            // Find user by email or username
            User user = userRepository.findByEmail(request.getUsernameOrEmail())
                    .orElseGet(() -> userRepository.findByUsername(request.getUsernameOrEmail())
                            .orElseThrow(() -> new RuntimeException("User not found")));

            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }

            // Check if active
            if (!user.isActive()) {
                throw new RuntimeException("User account is disabled");
            }

            String token = jwtTokenProvider.generateToken(user);

            AuthResponse response = new AuthResponse(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRoles(),
                    "Login successful"
            );

            //  SUCCESS AUDIT
            auditService.log(
                    user.getId(),
                    "USER_LOGIN",
                    "AUTH",
                    user.getId(),
                    request,
                    response,
                    200,
                    true
            );

            return response;

        } catch (Exception ex) {

            // FAILURE AUDIT (VERY IMPORTANT)
            auditService.log(
                    request.getUsernameOrEmail(),
                    "USER_LOGIN",
                    "AUTH",
                    null,
                    request,
                    "LOGIN_FAILED",
                    401,
                    false
            );

            throw ex;
        }
    }

}