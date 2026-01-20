package com.example.FoodApp.model;

import com.example.FoodApp.enums.FoodCategory;
import lombok.Data;

@Data
public class FoodItem {

    private String name;
    private double price;
    private FoodCategory category;
}
