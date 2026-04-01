package com.thanhhang.elearning.modules.iam.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/profile")
    public ResponseEntity<String> getUserProfile(Principal principal) {
        return ResponseEntity.ok("Hello, " + principal.getName() + "! This is your profile.");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin-only")
    public ResponseEntity<?> getAdminData() {
        return ResponseEntity.ok("Chào sếp! Đây là khu vực mật chỉ dành cho Quản trị viên.");
    }
    
    
}
