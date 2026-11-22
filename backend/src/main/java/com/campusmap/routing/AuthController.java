
package com.campusmap.routing;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.Map;

@Controller
public class AuthController {
    public AuthController(JdbcTemplate jdbc, PasswordEncoder passwordEncoder) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
    }
    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwordEncoder;


    @PostMapping("/api/signup")
    public ResponseEntity<Map<String, String>> signUp(@RequestParam("username") String username, @RequestParam("password") String password) {
        username = username.strip();

        if (!username.matches("[a-zA-Z0-9_]{3,64}")) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Use 3–64 letters, numbers, or underscores for your username.")
            );
        }

        if (password.length() < 5 || password.getBytes(StandardCharsets.UTF_8).length > 72) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Your password must have at least 5 characters")
            );
        }

        String passwordHash = passwordEncoder.encode(password);


        try {
            jdbc.update(
                    "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                    username,
                    passwordHash
            );
        } catch (DuplicateKeyException exception) {
            return ResponseEntity.status(409).body(
                    Map.of("error", "That username is already taken.")
            );
        }

        return ResponseEntity.status(201).body(
                Map.of("message", "Account created.")
        );

    }


    @GetMapping("/api/signup")
    public String signupPage(){
        return "signup";
    }

    @GetMapping("/api/login")
    public String loginPage(){
        return "login";
    }
    @GetMapping("/api/csrf")
    @ResponseBody
    public CsrfToken csrf(CsrfToken token) {
        return token;
    }

    @GetMapping("/api/me")
    public ResponseEntity<Map<String, String>> currentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(
                    Map.of("error", "You are not logged in.")
            );
        }

        return ResponseEntity.ok(
                Map.of("username", principal.getName())
        );
    }
}

