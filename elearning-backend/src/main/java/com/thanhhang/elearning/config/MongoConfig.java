
package com.thanhhang.elearning.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.thanhhang.elearning.modules.chat.repository")
public class MongoConfig {
}