package com.example.FoodApp.dto;

import com.example.FoodApp.enums.Role;
import lombok.Data;

@Data
public class LoginResponse {

    private String id;
    private String email;
    private Role role;
}
