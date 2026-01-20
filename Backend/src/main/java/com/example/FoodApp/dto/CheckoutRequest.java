package com.example.FoodApp.dto;

import java.util.List;
import lombok.Data;

@Data
public class CheckoutRequest {
    private String userId;
    private String restaurantId;
    private List<AddToCartRequest> items;
}
