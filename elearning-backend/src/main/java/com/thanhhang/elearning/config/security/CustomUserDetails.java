package com.thanhhang.elearning.config.security;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomUserDetails {
    private Long id;
    private String email;
    private String role;

    @Override
    public String toString() {
        return this.email;
    }
}