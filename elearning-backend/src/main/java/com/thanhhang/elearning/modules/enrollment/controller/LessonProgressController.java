package com.thanhhang.elearning.modules.enrollment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.thanhhang.elearning.modules.enrollment.service.LessonProgressService;

@RestController
@RequestMapping("/api/progress")
public class LessonProgressController {

    @Autowired
    private LessonProgressService progressService;

    // API Đánh dấu hoàn thành
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<?> completeLesson(@PathVariable Long lessonId) {
        progressService.markLessonAsCompleted(lessonId);
        return ResponseEntity.ok("Đã đánh dấu hoàn thành bài học");
    }

    // API Lấy danh sách ID bài đã học
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/courses/{courseId}/completed-lessons")
    public ResponseEntity<List<Long>> getCompletedLessons(@PathVariable Long courseId) {
        List<Long> completedLessonIds = progressService.getCompletedLessonIds(courseId);
        return ResponseEntity.ok(completedLessonIds);
    }
}