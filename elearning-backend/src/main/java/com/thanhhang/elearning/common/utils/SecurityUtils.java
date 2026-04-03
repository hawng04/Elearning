package com.thanhhang.elearning.common.utils;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.thanhhang.elearning.config.security.CustomUserDetails;

public class SecurityUtils {

    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            return authentication.getName(); 
        }
        throw new RuntimeException("Không tìm thấy thông tin đăng nhập!");
    }

    public static String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            // Spring Security lưu Role trong danh sách Authorities
            return authentication.getAuthorities().iterator().next().getAuthority();
        }
        throw new RuntimeException("Không tìm thấy quyền truy cập!");
    }

    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            
            // Ép kiểu Principal (chủ thể) thành CustomUserDetails để lấy ID
            Object principal = authentication.getPrincipal();
            if (principal instanceof CustomUserDetails) {
                return ((CustomUserDetails) principal).getId();
            }
        }
        throw new RuntimeException("Không thể xác định ID của người dùng!");
    }

    


}