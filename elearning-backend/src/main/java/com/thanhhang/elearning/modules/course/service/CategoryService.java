package com.thanhhang.elearning.modules.course.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.dto.CategoryRequest;
import com.thanhhang.elearning.modules.course.entity.Category;
import com.thanhhang.elearning.modules.course.repository.CategoryRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(CategoryRequest request) {
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN")) {
            throw new RuntimeException("Bạn không có quyền tạo danh mục");
        }

        Category category = Category.builder()
            .name(request.getName())
            .description(request.getDescription())
            .build();
        
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long categoryId, CategoryRequest request) {
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN")) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa danh mục");
        }

        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long categoryId) {
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN")) {
            throw new RuntimeException("Bạn không có quyền xóa danh mục");
        }

        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryRepository.delete(category);
    }

    
    
}
