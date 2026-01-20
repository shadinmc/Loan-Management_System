package com.example.FoodApp.repository;

import com.example.FoodApp.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
}
