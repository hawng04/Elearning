package com.thanhhang.elearning.modules.course.controller;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanhhang.elearning.modules.course.dto.request.LessonRequest;
import com.thanhhang.elearning.modules.course.service.LessonService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/lessons")
public class LessonController {
    @Autowired
    private LessonService lessonService;


    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @PostMapping("/sections/{sectionId}")
    public ResponseEntity<?> createLesson(@PathVariable Long sectionId, @RequestBody LessonRequest request) {
        try
        {
            return ResponseEntity.ok(lessonService.createLesson(sectionId, request));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi tạo bài học: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable Long id, @RequestBody LessonRequest request) {
        try
        {
            return ResponseEntity.ok(lessonService.updateLesson(id, request));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi cập nhật bài học: " + e.getMessage());
        }
        
    }

    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        try
        {
            lessonService.deleteLesson(id);
            return ResponseEntity.ok("Xóa bài học thành công");
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi xóa bài học: " + e.getMessage());
        }
        
    }

    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getLessonById(@PathVariable Long id) {
        try
        {
            return ResponseEntity.ok(lessonService.getLessonById(id));
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi lấy thông tin bài học: " + e.getMessage());
        }
        
    }

    @PreAuthorize("hasAnyRole('STUDENT')") 
    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeLesson(@PathVariable Long id) {
        try {
            lessonService.markLessonAsCompleted(id);
            return ResponseEntity.ok("Đã đánh dấu hoàn thành bài học");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }
     
    
    
}
