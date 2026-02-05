package com.lms.auth.dto;

import com.lms.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String username;
    private String email;
    private Set<User.Role> roles;
    private String message;
}