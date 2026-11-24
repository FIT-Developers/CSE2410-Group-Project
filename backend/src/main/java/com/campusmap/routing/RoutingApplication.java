package com.campusmap.routing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RoutingApplication {

    public static void main(String[] args) throws Exception {
        new MapBuilder();
        SpringApplication.run(RoutingApplication.class, args);
    }
}