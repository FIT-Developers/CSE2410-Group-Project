package com.campusmap.routing.model;


import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;


@Configuration
public class AccountConfig
{
   @Bean
   public static PasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
   }

   @Bean
   public UserDetailsService userDetailsService(JdbcTemplate jdbc){
       String sql = "SELECT username, password_hash FROM users WHERE username = ?";
       return username -> {
           List<UserDetails> account = jdbc.query(
                   sql,
                   (row, rowNumber) -> User.withUsername(row.getString("username"))
                   .password(row.getString("password_hash"))
                   .build(),
           username
           );
           if (account.isEmpty()) {
               throw new UsernameNotFoundException("Account not found");
           }

           return account.get(0);
       };
   }
}
