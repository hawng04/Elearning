package com.thanhhang.elearning.modules.course.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.dto.request.CourseRequest;
import com.thanhhang.elearning.modules.course.entity.Course;
import com.thanhhang.elearning.modules.course.service.CategoryService;
import com.thanhhang.elearning.modules.course.service.CourseService;
import com.thanhhang.elearning.modules.course.service.LessonService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<?> getAllCourse() {
        try
        {
            return ResponseEntity.ok(courseService.getAllCourses());
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi lấy danh sách khóa học: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try
        {
            return ResponseEntity.ok(courseService.getCourseById(id));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi lấy thông tin khóa học: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest request) {
        try
        {
            return ResponseEntity.ok(courseService.createCourse(request));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi tạo khóa học: " + e.getMessage());
        }

        
    }
    

    
    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody CourseRequest request) {
        try
        {
            return ResponseEntity.ok(courseService.updateCourse(id, request));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi cập nhật khóa học: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try
        {
            courseService.deleteCourse(id);
            return ResponseEntity.ok("Xóa khóa học thành công");
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi xóa khóa học: " + e.getMessage());
        }
    }

    // @PreAuthorize("isAuthenticated()")
    // @GetMapping("/{courseId}/completed-lessons")
    // public ResponseEntity<List<Long>> getCompletedLessons(@PathVariable Long courseId) {
    //     List<Long> completedLessonIds = lessonService.getCompletedLessonIds(courseId);
    //     return ResponseEntity.ok(completedLessonIds);
    // }

    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @GetMapping("/my-teaching-courses")
    public ResponseEntity<?> getMyTeachingCourses() {
        try {
            return ResponseEntity.ok(courseService.getMyTeachingCourses());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi lấy danh sách khóa học của giảng viên: " + e.getMessage());
        }
    }
}
