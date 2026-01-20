package com.example.FoodApp.controller;



import com.example.FoodApp.dto.AddFoodRequest;
import com.example.FoodApp.dto.AddRestaurantRequest;
import com.example.FoodApp.model.Restaurant;
import com.example.FoodApp.service.RestaurantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@CrossOrigin
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    // ADMIN: ADD RESTAURANT
    @PostMapping("/add")
    public Restaurant addRestaurant(
            @RequestParam String adminId,
            @RequestBody AddRestaurantRequest request) {

        return restaurantService.addRestaurant(adminId, request);
    }

    // ADMIN: ADD FOOD
    @PostMapping("/{restaurantId}/add-food")
    public Restaurant addFood(
            @RequestParam String adminId,
            @PathVariable String restaurantId,
            @RequestBody AddFoodRequest request) {

        return restaurantService.addFood(adminId, restaurantId, request);
    }

    // USER: VIEW ALL RESTAURANTS
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    // USER: VIEW MENU
    @GetMapping("/{restaurantId}")
    public Restaurant getRestaurant(@PathVariable String restaurantId) {
        return restaurantService.getRestaurantById(restaurantId);
    }
}

