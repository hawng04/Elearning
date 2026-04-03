package com.thanhhang.elearning.modules.course.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.modules.course.dto.SectionRequest;
import com.thanhhang.elearning.modules.course.entity.Course;
import com.thanhhang.elearning.modules.course.entity.Section;

@Service
public class SectionService {
    @Autowired
    private CourseService courseService;

    @Autowired
    private LessonService lessonService;

    // public Section createSection(SectionRequest request) {
    //     Course course = courseService.getCourseById(request.getCourseId());

    //     Long currentUserId = SecurityUtils.getCurrentUserId();
    //     String userRole = SecurityUtils.getCurrentUserRole();
    //     if ( && !userRole.equals("ADMIN")) {
    //         throw new RuntimeException("Bạn không có quyền tạo phần học");
    //     }
    //     var course = courseService.getCourseById(courseId);
    //     if (course == null) {
    //         throw new RuntimeException("Course not found");
    //     }

    //     Section section = Section.builder()
    //         .title(title)
    //         .course(course)
    //         .build();

    //     return courseService.addSectionToCourse(courseId, section);
    // }

    
}
