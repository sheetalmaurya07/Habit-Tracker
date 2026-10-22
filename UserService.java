package com.sheetal.habittracker.service;

import com.sheetal.habittracker.entity.User;
import com.sheetal.habittracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }

    public List<User> getAllUsers() { return userRepository.findAll(); }
    public User saveUser(User user) { return userRepository.save(user); }
    public User getUser(String userName) { return userRepository.findByUserName(userName); }

    public User updateUser(User user)
    {
        Optional<User> userOpt = userRepository.findById(user.getId());

        if (userOpt.isPresent()) {
            User usr = userOpt.get();
             
            usr.setFullName(user.getFullName());
            
            return userRepository.save(usr); 
        }

        return null; 
    }
}
