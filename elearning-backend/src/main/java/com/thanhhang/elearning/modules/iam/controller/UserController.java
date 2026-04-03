package com.thanhhang.elearning.modules.iam.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanhhang.elearning.modules.iam.dto.ChangePasswordRequest;
import com.thanhhang.elearning.modules.iam.dto.UpdateProfileRequest;
import com.thanhhang.elearning.modules.iam.entity.User;
import com.thanhhang.elearning.modules.iam.service.UserService;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        User updatedUser = userService.updateProfile(request);
        return ResponseEntity.ok(updatedUser);
    }

    // @PreAuthorize("hasRole('ADMIN')")
    // @GetMapping
    // public ResponseEntity<?> getAllUsers(@RequestParam(required = false) String role) {
    //     if (role != null) {
    //         return ResponseEntity.ok(userService.getUsersByRole(role));
    //     }
    //     return ResponseEntity.ok(userService.getAllUsers());
    // }





    
    
    
}
