package com.thanhhang.elearning.modules.iam.service;

import java.util.List;

import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.config.security.JwtUtil;
import com.thanhhang.elearning.modules.iam.dto.ChangePasswordRequest;
import com.thanhhang.elearning.modules.iam.dto.LoginRequest;
import com.thanhhang.elearning.modules.iam.dto.RegisterRequest;
import com.thanhhang.elearning.modules.iam.dto.UpdateProfileRequest;
import com.thanhhang.elearning.modules.iam.entity.User;
import com.thanhhang.elearning.modules.iam.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email này đã tồn tại trong hệ thống!");
        }

        String roleUser = request.getRole() != null ? request.getRole().toUpperCase() : "STUDENT";

        User newUser = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(roleUser) 
                .build();

        return userRepository.save(newUser);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không đúng"));
        
        if (!user.isActive()) {
            throw new RuntimeException("Tài khoản của bạn đã bị khóa hoặc đã bị xóa khỏi hệ thống!");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }



        return jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public void changePassword (ChangePasswordRequest request) {
        User currentUser = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không chính xác!");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

    public User getUserById (Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng này!"));
    }

    public User updateProfile(UpdateProfileRequest request) {
        User currentUser = getCurrentUser();

        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            currentUser.setFullName(request.getFullName());
        }
        if (request.getAvatarUrl() != null) {
            currentUser.setAvatarUrl(request.getAvatarUrl());
        }

        if (request.getBio() != null) {
            currentUser.setBio(request.getBio());
        }

        return userRepository.save(currentUser);
    }

    //ADMIN FUNCTIONS


    public void adminLockUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng này!"));

        user.setActive(false);
        userRepository.save(user);

    }

    public void adminUnlockUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng này!"));

        user.setActive(true);
        userRepository.save(user);

    }

    public User adminUpdateUser(Long userId, String newRole, String newFullName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng này!"));

        if (newFullName != null) user.setFullName(newFullName);
        if (newRole != null) user.setRole(newRole.toUpperCase());

        return userRepository.save(user);
    }

    public List<User> adminGetAllUsers() {
        return userRepository.findAll();
    }


    
}
