package com.sheetal.habittracker.controller;

import com.sheetal.habittracker.entity.CustomResponse;
import com.sheetal.habittracker.entity.User;
import com.sheetal.habittracker.service.UserService;
import com.sheetal.habittracker.security.JwtUtil;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        // Normally you'd check password with hashing
        User existing = userService.getAllUsers().stream()
                .filter(u -> u.getUserName().equals(user.getUserName()))
                .findFirst()
                .orElse(null);

        if (existing != null && existing.getPassword().equals(user.getPassword())) {
            return jwtUtil.generateToken(user.getUserName());
        }
        return "Invalid credentials";
    }

    @GetMapping("/user")
    public User getUserByBame(@RequestParam String userName) {
        return userService.getUser(userName);
    }

    @PostMapping("/register")
    public CustomResponse registerUser(@RequestBody User user) {
        User existing = userService.getAllUsers().stream()
                .filter(u -> u.getUserName().equals(user.getUserName()))
                .findFirst()
                .orElse(null);
        
        CustomResponse response;
        if(existing != null)
        {
            response =  new CustomResponse();
            response.setIsSuccess(false);
            response.setId(null);
            response.setMessage("User already exists");

            return  response;
        }

        User result = userService.saveUser(user);

        response =  new CustomResponse();
        response.setIsSuccess(true);
        response.setId(result.getId());
        response.setMessage("User registered successfully");

        return  response;
    }

    @PostMapping("/profile")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }
}