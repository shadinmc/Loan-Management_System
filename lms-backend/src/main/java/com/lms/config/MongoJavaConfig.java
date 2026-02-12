package com.lms.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
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

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(
                List.of(new StringToBinaryConverter())
        );
    }

    static class StringToBinaryConverter implements Converter<String, Binary> {
        @Override
        public Binary convert(String source) {
            if (source == null || source.isBlank()) {
                return null;
            }

            String base64 = source;
            int commaIndex = source.indexOf(',');
            if (commaIndex >= 0) {
                base64 = source.substring(commaIndex + 1);
            }

            byte[] bytes = Base64.getDecoder().decode(base64);
            return new Binary(BsonBinarySubType.BINARY, bytes);
        }
    }
}
