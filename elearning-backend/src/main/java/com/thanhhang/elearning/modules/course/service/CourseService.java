package com.thanhhang.elearning.modules.course.service;

import java.security.Security;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.catalina.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.dto.request.CourseRequest;
import com.thanhhang.elearning.modules.course.dto.response.CourseResponse;
import com.thanhhang.elearning.modules.course.dto.response.SectionResponse;
import com.thanhhang.elearning.modules.course.entity.Category;
import com.thanhhang.elearning.modules.course.entity.Course;
import com.thanhhang.elearning.modules.course.repository.CategoryRepository;
import com.thanhhang.elearning.modules.course.repository.CourseRepository;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Course createCourse(CourseRequest request) {

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();

        Long finalTeacherId = currentUserId;

        if (request.getTeacherId() != null && userRole.equals("ADMIN")) {
            finalTeacherId = request.getTeacherId();
        }

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        Course course = Course.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .price(request.getPrice())
            .imageUrl(request.getImageUrl())
            .status("DRAFT")
            .category(category)
            .teacherId(finalTeacherId)
            .build();

        return courseRepository.save(course);
    }

    public Course updateCourse(Long courseId, CourseRequest request) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();

        if (!course.getTeacherId().equals(currentUserId) && !userRole.equals("ADMIN")) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa khóa học này");
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setImageUrl(request.getImageUrl());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
            course.setCategory(category);
        }
        return courseRepository.save(course);
    }

    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();

        if (!course.getTeacherId().equals(currentUserId) && !userRole.equals("ADMIN")) {
            throw new RuntimeException("Bạn không có quyền xóa khóa học này");
        }

        courseRepository.delete(course);
    }

    public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        
        return courses.stream().map(course -> CourseResponse.builder()
            .id(course.getId())
            .title(course.getTitle())
            .description(course.getDescription())
            .imageUrl(course.getImageUrl())
            .teacherId(course.getTeacherId())
            .price(course.getPrice())
            .status(course.getStatus())
            .categoryName(course.getCategory().getName())
            .sections(course.getSections())
            .build()).collect(Collectors.toList());
    }

    public long getTotalLessonsInCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        return course.getSections().stream()
            .flatMap(section -> section.getLessons().stream())
            .count();
    }
    
}
