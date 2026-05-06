package com.thanhhang.elearning.modules.course.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thanhhang.elearning.modules.course.entity.UserLessonProgress;

public interface UserLessonProgressRepository  extends JpaRepository <UserLessonProgress, Long> {
     Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

     boolean existsByUserIdAndLessonId(Long userId, Long lessonId);

    

}
