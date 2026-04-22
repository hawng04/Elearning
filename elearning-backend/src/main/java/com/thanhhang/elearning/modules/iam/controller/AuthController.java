package com.thanhhang.elearning.modules.iam.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanhhang.elearning.config.security.JwtUtil;
import com.thanhhang.elearning.modules.iam.dto.AuthResponse;
import com.thanhhang.elearning.modules.iam.dto.LoginRequest;
import com.thanhhang.elearning.modules.iam.dto.RegisterRequest;
import com.thanhhang.elearning.modules.iam.entity.User;
import com.thanhhang.elearning.modules.iam.repository.UserRepository;
import com.thanhhang.elearning.modules.iam.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
   

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult result) {
        
        if (result.hasErrors()) {
            String errorMessage = result.getFieldError().getDefaultMessage();
            return ResponseEntity.badRequest().body("Lỗi dữ liệu: " + errorMessage);
        }

        try {
            userService.register(request);
            return ResponseEntity.ok("Đăng ký tài khoản thành công!");
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email hoặc mật khẩu không chính xác!");
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email hoặc mật khẩu không chính xác!");
        }
        String jwtToken = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(AuthResponse.from(jwtToken, user));
    }
    

}
