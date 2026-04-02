package com.thanhhang.elearning.modules.course.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.dto.CourseRequest;
import com.thanhhang.elearning.modules.course.entity.Category;
import com.thanhhang.elearning.modules.course.entity.Course;
import com.thanhhang.elearning.modules.course.repository.CategoryRepository;
import com.thanhhang.elearning.modules.course.repository.CourseRepository;
import com.thanhhang.elearning.modules.iam.entity.User;
import com.thanhhang.elearning.modules.iam.repository.UserRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository  userRepository;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return ResponseEntity.ok(courseRepository.findByCategoryId(categoryId));
        }
        return ResponseEntity.ok(courseRepository.findAll());
    }
    
    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest courseRequest) {

        String email = SecurityUtils.getCurrentUserEmail();
        User teacher = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Category category = categoryRepository.findById(courseRequest.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        Course newCourse = Course.builder()
            .title(courseRequest.getTitle())
            .description(courseRequest.getDescription())
            .price(courseRequest.getPrice())
            .imageUrl(courseRequest.getImageUrl())
            .status("DRAFT")
            .category(category)
            .teacher(teacher)
            .build();

        courseRepository.save(newCourse);

        return ResponseEntity.ok("Course created successfully") ;
    }

    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody CourseRequest courseRequest) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (!currentUser.getRole().equals("ADMIN") && !course.getTeacher().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You don't have permission to update this course");
        }

       

        course.setTitle(courseRequest.getTitle());
        course.setDescription(courseRequest.getDescription());
        course.setPrice(courseRequest.getPrice());
        course.setImageUrl(courseRequest.getImageUrl());

        if (courseRequest.getCategoryId()!= null    ) {
            Category category = categoryRepository.findById(courseRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            course.setCategory(category);
        }

        courseRepository.save(course);
        return ResponseEntity.ok("Course updated successfully") ;
    }

    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (!currentUser.getRole().equals("ADMIN") && !course.getTeacher().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You don't have permission to delete this course");
        }

        courseRepository.delete(course);
        return ResponseEntity.ok("Course deleted successfully") ;
    }
}
