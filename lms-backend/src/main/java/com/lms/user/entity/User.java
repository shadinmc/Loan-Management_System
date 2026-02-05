package com.lms.user.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String userId;

    private String fullName;
    private String email;
    private String phone;

    private String pan;
    private String aadhaar;

    private Integer creditScore;
}
