package com.example.FoodApp.model;

import com.example.FoodApp.enums.Role;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String email;
    private String password;
    private String name;
    private String phoneNumber;
    private Role role;
    private String address;
}
