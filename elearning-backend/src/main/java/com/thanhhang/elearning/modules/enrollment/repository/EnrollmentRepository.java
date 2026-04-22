package com.thanhhang.elearning.modules.enrollment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanhhang.elearning.modules.enrollment.entity.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
     boolean existsByCourseIdAndStudentId(Long courseId, Long studentId);
     List<Enrollment> findAllByStudentId(Long studentId);
    Optional<Enrollment> findByCourseIdAndStudentId(Long courseId, Long studentId);
}
