package com.example.FoodApp.service;

import com.example.FoodApp.dto.AddFoodRequest;
import com.example.FoodApp.dto.AddRestaurantRequest;
import com.example.FoodApp.enums.Role;
import com.example.FoodApp.model.FoodItem;
import com.example.FoodApp.model.Restaurant;
import com.example.FoodApp.model.User;
import com.example.FoodApp.repository.RestaurantRepository;
import com.example.FoodApp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public RestaurantService(RestaurantRepository restaurantRepository,
                             UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    // ADMIN CHECK
    private void checkAdmin(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied: Admin only");
        }
    }

    // ADD RESTAURANT
    public Restaurant addRestaurant(String adminId, AddRestaurantRequest request) {

        checkAdmin(adminId);

        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setFoodItems(new ArrayList<>());

        return restaurantRepository.save(restaurant);
    }

    // ADD FOOD TO RESTAURANT
    public Restaurant addFood(String adminId, String restaurantId, AddFoodRequest request) {

        checkAdmin(adminId);

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        FoodItem food = new FoodItem();
        food.setName(request.getName());
        food.setPrice(request.getPrice());
        food.setCategory(request.getCategory());

        restaurant.getFoodItems().add(food);

        return restaurantRepository.save(restaurant);
    }

    // GET ALL RESTAURANTS (USER)
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    // GET MENU BY RESTAURANT
    public Restaurant getRestaurantById(String restaurantId) {
        return restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }
}

