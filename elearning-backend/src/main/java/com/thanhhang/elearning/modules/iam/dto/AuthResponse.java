package com.thanhhang.elearning.modules.iam.dto;

import com.thanhhang.elearning.modules.iam.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UserInfo user;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInfo {
        private Long id;
        private String email;
        private String fullName;
        private String role;
        private String avatarUrl;
    }

    public static AuthResponse from(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .user(UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .avatarUrl(user.getAvatarUrl())
                        .build())
                .build();
    }
}