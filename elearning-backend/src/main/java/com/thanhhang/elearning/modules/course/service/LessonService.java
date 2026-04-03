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

    @Autowired
    private UserRepository userRepository;

    public Lesson createLesson(Long sectionId, LessonRequest request) {

        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        User currentUser = userRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = section.getCourse();
        if (!currentUser.getRole().equals("ADMIN") && !course.getTeacher().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to create lesson in this course");
        }

        Lesson lesson = Lesson.builder()
                .title(request.getTitle())
                .videoUrl(request.getVideoUrl())
                .content(request.getContent())
                .isFreePreview(request.getIsFreePreview()!= null ? request.getIsFreePreview() : false)
                .orderIndex(request.getOrderIndex())
                .section(section)
                .build();
            
        return lessonRepository.save(lesson);
    }
    
}
