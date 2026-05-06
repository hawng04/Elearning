package com.thanhhang.elearning.modules.enrollment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.service.CourseService;
import com.thanhhang.elearning.modules.enrollment.entity.Enrollment;
import com.thanhhang.elearning.modules.enrollment.entity.LessonProgress;
import com.thanhhang.elearning.modules.enrollment.repository.EnrollmentRepository;
import com.thanhhang.elearning.modules.enrollment.repository.LessonProgressRepository;
import com.thanhhang.elearning.modules.payment.dto.PaymentRequest;
import com.thanhhang.elearning.modules.payment.service.PaymentService;

@Service
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired private LessonProgressRepository lessonProgressRepository;
    @Autowired private CourseService courseService;
    @Autowired private PaymentService paymentService;

    public Enrollment enroll(Long courseId, PaymentRequest paymentRequest)
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

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        paymentService.savePayment(courseId, studentId, paymentRequest);


        return savedEnrollment;
    }

    public List<Enrollment> getMyEnrollments() {
        Long studentId = SecurityUtils.getCurrentUserId();
        return enrollmentRepository.findAllByStudentId(studentId);
    }

    public String markLessonAsCompleted(Long courseId, Long lessonId) {

        Long studentId = SecurityUtils.getCurrentUserId();

        Enrollment enrollment = enrollmentRepository.findByCourseIdAndStudentId(courseId, studentId)
                .orElseThrow(() -> new RuntimeException("Bạn chưa đăng ký khóa học này"));

        LessonProgress progress = lessonProgressRepository.findByEnrollmentIdAndLessonId(enrollment.getId(), lessonId)
                .orElse(LessonProgress.builder()
                        .enrollment(enrollment)
                        .lessonId(lessonId)
                        .isCompleted(false)
                        .build());
        if (progress.isCompleted()) {
            return "Bạn đã hoàn thành bài học này rồi.";
        }

        progress.setCompleted(true);
        progress.setCompletedAt(java.time.LocalDateTime.now());
        lessonProgressRepository.save(progress);

        Long totalLessons = courseService.getTotalLessonsInCourse(courseId);
        Long completedLessons = lessonProgressRepository.countByEnrollmentIdAndIsCompletedTrue(enrollment.getId());

        if (completedLessons >= totalLessons ) {
            enrollment.setStatus("COMPLETED");
            enrollmentRepository.save(enrollment);
            return "Chúc mừng! Bạn đã hoàn thành khóa học này.";
        }

        return "Bạn đã hoàn thành bài học. Tiếp tục học để hoàn thành khóa học nhé!";
    }

    
    


    
}
