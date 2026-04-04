package com.thanhhang.elearning.modules.course.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanhhang.elearning.modules.course.entity.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
     boolean existsByCourseIdAndStudentId(Long courseId, Long studentId);
     List<Enrollment> findAllByStudentId(Long studentId);
    
}
