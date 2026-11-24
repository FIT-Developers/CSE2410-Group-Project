package com.campusmap.routing;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http.authorizeHttpRequests(authorize -> authorize.requestMatchers("/api/signup", "/api/login","/api/csrf","/api/route")
                .permitAll()
                .anyRequest().authenticated());

        return http.build();
    }
}
