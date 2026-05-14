package com.thanhhang.elearning.modules.enrollment.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.entity.Lesson;
import com.thanhhang.elearning.modules.course.repository.LessonRepository;
import com.thanhhang.elearning.modules.enrollment.entity.Enrollment;
import com.thanhhang.elearning.modules.enrollment.entity.LessonProgress;
import com.thanhhang.elearning.modules.enrollment.repository.EnrollmentRepository;
import com.thanhhang.elearning.modules.enrollment.repository.LessonProgressRepository;

@Service
public class LessonProgressService {

    @Autowired
    private LessonProgressRepository progressRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonRepository lessonRepository; 

    public void markLessonAsCompleted(Long lessonId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Long courseId = lesson.getSection().getCourse().getId();

        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(currentUserId, courseId)
            .orElseThrow(() -> new RuntimeException("Học viên chưa đăng ký khóa học này!"));

        boolean alreadyCompleted = progressRepository.existsByEnrollmentIdAndLessonId(enrollment.getId(), lessonId);

        if (!alreadyCompleted) {
            LessonProgress progress = LessonProgress.builder()
                .enrollment(enrollment) 
                .lessonId(lessonId)     
                .isCompleted(true)
                .completedAt(LocalDateTime.now())
                .build();
            progressRepository.save(progress);
        }
    }

    // 2. HÀM LẤY DANH SÁCH BÀI ĐÃ HỌC
    public List<Long> getCompletedLessonIds(Long courseId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return progressRepository.findCompletedLessonIds(currentUserId, courseId);
    }
}