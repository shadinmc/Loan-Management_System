package com.example.FoodApp.dto;
import com.example.FoodApp.enums.FoodCategory;
import lombok.Data;

@Data
public class AddFoodRequest {
    private String name;
    private double price;
    private FoodCategory category;
}

