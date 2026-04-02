package com.thanhhang.elearning.modules.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanhhang.elearning.modules.course.entity.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    
}
