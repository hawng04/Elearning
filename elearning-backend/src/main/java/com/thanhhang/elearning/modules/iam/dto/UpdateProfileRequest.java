package com.thanhhang.elearning.modules.iam.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String avatarUrl;
    private String bio;
    
}
