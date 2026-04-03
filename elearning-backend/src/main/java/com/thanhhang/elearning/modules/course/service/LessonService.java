package com.thanhhang.elearning.modules.course.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.dto.LessonRequest;
import com.thanhhang.elearning.modules.course.entity.Course;
import com.thanhhang.elearning.modules.course.entity.Lesson;
import com.thanhhang.elearning.modules.course.entity.Section;
import com.thanhhang.elearning.modules.course.repository.LessonRepository;
import com.thanhhang.elearning.modules.course.repository.SectionRepository;
import com.thanhhang.elearning.modules.iam.entity.User;
import com.thanhhang.elearning.modules.iam.repository.UserRepository;

@Service
public class LessonService {
    @Autowired
    private LessonRepository lessonRepository;

     @Autowired
    private SectionRepository sectionRepository;

    public Lesson createLesson(Long sectionId, LessonRequest request) {
        Section section = sectionRepository.findById(sectionId)
            .orElseThrow(() -> new RuntimeException("Section not found"));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN") && !section.getCourse().getTeacherId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to create lesson in this course");
        }

        Lesson lesson = Lesson.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .orderIndex(Integer.parseInt(request.getOrderIndex()))
            .section(section)
            .build();

        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(Long lessonId, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN") && !lesson.getSection().getCourse().getTeacherId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to update lesson in this course");
        }

        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setOrderIndex(Integer.parseInt(request.getOrderIndex()));

        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN") && !lesson.getSection().getCourse().getTeacherId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to delete lesson in this course");
        }

        lessonRepository.delete(lesson);
    }

    public Lesson getLessonById(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN") && !lesson.getSection().getCourse().getTeacherId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to view lesson in this course");
        }

        return lesson;
    }

    

    
    
}
