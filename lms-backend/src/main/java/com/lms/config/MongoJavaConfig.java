package com.lms.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.bson.BsonBinarySubType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import java.util.Base64;
import java.util.List;

@Configuration
public class MongoJavaConfig {

    private static final String DATABASE_NAME = "lms_dev";
    private static final String MONGO_URI = "mongodb://localhost:27017";

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(MONGO_URI);
    }

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClient mongoClient) {
        return new SimpleMongoClientDatabaseFactory(mongoClient, DATABASE_NAME);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoDatabaseFactory factory) {
        return new MongoTemplate(factory);
    }



}
