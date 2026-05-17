package com.thanhhang.elearning.modules.course.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.dto.request.SectionRequest;
import com.thanhhang.elearning.modules.course.entity.Course;
import com.thanhhang.elearning.modules.course.entity.Section;
import com.thanhhang.elearning.modules.course.repository.CourseRepository;
import com.thanhhang.elearning.modules.course.repository.SectionRepository;

@Service
public class SectionService {
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
     private SectionRepository sectionRepository;
   

    public Section createSection(Long courseId, SectionRequest request) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN") && !course.getInstructorId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to create section in this course");
        }

        Section section = Section.builder()
            .title(request.getTitle())
            .orderIndex(Integer.parseInt(request.getOrderIndex()))
            .course(course)
            .build();

        return sectionRepository.save(section);
    }

    public Section updateSection(Long sectionId, SectionRequest request) {
        Section section = sectionRepository.findById(sectionId)
            .orElseThrow(() -> new RuntimeException("Section not found"));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN") && !section.getCourse().getInstructorId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to update section in this course");
        }

        section.setTitle(request.getTitle());
        section.setOrderIndex(Integer.parseInt(request.getOrderIndex()));

        return sectionRepository.save(section);
    }

    public void deleteSection(Long sectionId) {
        Section section = sectionRepository.findById(sectionId)
            .orElseThrow(() -> new RuntimeException("Section not found"));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN") && !section.getCourse().getInstructorId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to delete section in this course");
        }

        sectionRepository.delete(section);
    }

    public Section getSectionById(Long sectionId) {
        return sectionRepository.findById(sectionId)
            .orElseThrow(() -> new RuntimeException("Section not found"));
    }



    
}
