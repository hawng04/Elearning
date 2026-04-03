package com.thanhhang.elearning.modules.iam.controller;

import com.thanhhang.elearning.modules.iam.dto.RegisterRequest;
import com.thanhhang.elearning.modules.iam.entity.User;
import com.thanhhang.elearning.modules.iam.repository.UserRepository;
import com.thanhhang.elearning.modules.iam.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {

    @Autowired
    private UserService userService;


    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest request) {
       User newuser = userService.register(request);
        return ResponseEntity.ok(newuser);
    }

    @PutMapping("/users/{id}/lock")
    public ResponseEntity<?> lockUser(@PathVariable Long id) {
        userService.adminLockUser(id);
        return ResponseEntity.ok("User locked successfully");
    }

    @PutMapping("/users/{id}/unlock")
    public ResponseEntity<?> unlockUser(@PathVariable Long id) {
        userService.adminUnlockUser(id);
        return ResponseEntity.ok("User unlocked successfully");
    }


}