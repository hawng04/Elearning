package com.thanhhang.elearning.modules.enrollment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanhhang.elearning.modules.enrollment.dto.EnrollmentResponseDTO;
import com.thanhhang.elearning.modules.enrollment.entity.Enrollment;
import com.thanhhang.elearning.modules.enrollment.service.EnrollmentService;
import com.thanhhang.elearning.modules.payment.dto.PaymentRequest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/{courseId}")
    public Enrollment enroll(
            @PathVariable Long courseId,
            @RequestBody(required = false) PaymentRequest paymentRequest 
    ) {
        try {
            // Truyền cả 2 thứ sang cho Service xử lý
            return enrollmentService.enroll(courseId, paymentRequest); 
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi đăng ký khóa học: " + e.getMessage());
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my-courses")
    public ResponseEntity<List<EnrollmentResponseDTO>> getMyEnrollments() {
        List<EnrollmentResponseDTO> enrollments = enrollmentService.getMyEnrollments();
        return ResponseEntity.ok(enrollments);
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
