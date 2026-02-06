package com.lms.user.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String username;

    private String password;
    private String fullName;
    private String phone;
    private String branchCode;

    private Set<Role> roles;

    private boolean active = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Role role;

    public enum Role {
        USER,
        BRANCH_MANAGER,
        REGIONAL_MANAGER
    }
}