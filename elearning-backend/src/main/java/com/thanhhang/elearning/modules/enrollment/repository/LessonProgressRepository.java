package com.thanhhang.elearning.modules.enrollment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thanhhang.elearning.modules.enrollment.entity.LessonProgress;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);
    boolean existsByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);
    Long countByEnrollmentIdAndIsCompletedTrue(Long enrollmentId);
    @Query("SELECT p.lessonId FROM LessonProgress p WHERE p.enrollment.studentId = :userId AND p.enrollment.courseId = :courseId AND p.isCompleted = true")
    List<Long> findCompletedLessonIds(@Param("userId") Long userId, @Param("courseId") Long courseId);
}
