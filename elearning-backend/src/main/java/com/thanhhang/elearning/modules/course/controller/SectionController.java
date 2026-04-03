package com.thanhhang.elearning.modules.course.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import com.thanhhang.elearning.modules.course.dto.SectionRequest;
import com.thanhhang.elearning.modules.course.entity.Section;
import com.thanhhang.elearning.modules.course.service.SectionService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/sections")
public class SectionController {
    @Autowired
    private SectionService sectionService;

    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @PostMapping("")
    public ResponseEntity<?> createSection(Long courseId, SectionRequest request) {
        try
        {
            Section section = sectionService.createSection(courseId, request);
            return ResponseEntity.ok(section);
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi tạo phần học: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSection(@PathVariable Long id, @RequestBody SectionRequest request) {
        try
        {
            Section section = sectionService.updateSection(id, request);
            return ResponseEntity.ok(section);
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi cập nhật phần học: " + e.getMessage());
        }
    }

     @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @PostMapping("/{id}")
    public ResponseEntity<?> deleteSection(@PathVariable Long id) {
        try
        {
            sectionService.deleteSection(id);
            return ResponseEntity.ok("Xóa phần học thành công");
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi xóa phần học: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN','TEACHER')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getSectionById(@PathVariable Long id) {
        try
        {
            Section section = sectionService.getSectionById(id);
            return ResponseEntity.ok(section);
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Lỗi khi lấy thông tin phần học: " + e.getMessage());
        }
    }


}
