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

        http.authorizeHttpRequests(authorize -> authorize.requestMatchers("/api/signup", "/api/login","/api/csrf","/api/route","/api/me")
                .permitAll()
                .anyRequest().authenticated());
        http.formLogin(form -> form
                .loginPage("/login.html")
                .loginProcessingUrl("/api/login")
                .successHandler((request, response, authentication) -> {
                    response.setStatus(200);
                })
                .failureHandler((request, response, exception) -> {
                    response.setStatus(401);
                })
        );
        http.exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(401);
                })
        );
        http.logout(logout -> logout
                .logoutUrl("/api/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(204);
                })
        );
        return http.build();
    }
}
