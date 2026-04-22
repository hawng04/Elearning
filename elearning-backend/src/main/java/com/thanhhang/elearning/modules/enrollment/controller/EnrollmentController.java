package com.thanhhang.elearning.modules.enrollment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanhhang.elearning.modules.enrollment.entity.Enrollment;
import com.thanhhang.elearning.modules.enrollment.service.EnrollmentService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/{courseId}")
    public Enrollment enroll(@PathVariable Long courseId) {
        try {
            return enrollmentService.enroll(courseId);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi đăng ký khóa học: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my-courses")
    public List<Enrollment> getMyEnrollments() {
        try {
            return enrollmentService.getMyEnrollments();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy danh sách đăng ký: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/courses/{courseId}/lessons/{lessonId}/complete")
    public ResponseEntity<?>  markLessonAsCompleted(@PathVariable Long courseId, @PathVariable Long lessonId) {
        try
        {
            String result = enrollmentService.markLessonAsCompleted(courseId, lessonId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi đánh dấu bài học hoàn thành: " + e.getMessage());
        }
    }


    
}
