package com.example.FoodApp.model;


import com.example.FoodApp.enums.OrderStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "carts")
public class Cart {

    @Id
    private String id;

    private String userId;
    private String restaurantId;

    private List<CartItem> items;

    private double totalPrice;

    private OrderStatus status;
}
