package com.thanhhang.elearning.modules.course.service;

import java.security.Security;
import java.util.List;

import org.apache.catalina.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.entity.Enrollment;
import com.thanhhang.elearning.modules.course.repository.EnrollmentRepository;

@Service
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public Enrollment enroll(Long courseId)
    {
        Long studentId = SecurityUtils.getCurrentUserId();
        if (enrollmentRepository.existsByCourseIdAndStudentId(courseId, studentId)) {
            throw new IllegalStateException("Bạn đã đăng ký khóa học này rồi.");
        }

        Enrollment enrollment = Enrollment.builder()
                .courseId(courseId)
                .studentId(studentId)
                .enrollmentDate(java.time.LocalDateTime.now())
                .status("ENROLLED")
                .build();


        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getMyEnrollments() {
        Long studentId = SecurityUtils.getCurrentUserId();
        return enrollmentRepository.findAllByStudentId(studentId);
    }

    
    


    
}
