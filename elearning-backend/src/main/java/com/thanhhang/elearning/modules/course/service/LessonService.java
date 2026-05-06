package com.thanhhang.elearning.modules.course.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.dto.request.LessonRequest;
import com.thanhhang.elearning.modules.course.dto.response.YoutubeVideoInfoResponse;
import com.thanhhang.elearning.modules.course.entity.Course;
import com.thanhhang.elearning.modules.course.entity.Lesson;
import com.thanhhang.elearning.modules.course.entity.Section;
import com.thanhhang.elearning.modules.course.entity.UserLessonProgress;
import com.thanhhang.elearning.modules.course.repository.LessonRepository;
import com.thanhhang.elearning.modules.course.repository.SectionRepository;
import com.thanhhang.elearning.modules.course.repository.UserLessonProgressRepository;
import com.thanhhang.elearning.modules.iam.entity.User;
import com.thanhhang.elearning.modules.iam.repository.UserRepository;

@Service
public class LessonService {
    @Autowired
    private LessonRepository lessonRepository;

     @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private YouTubeService youtubeService;

    @Autowired
    private UserLessonProgressRepository progressRepository;

    public Lesson createLesson(Long sectionId, LessonRequest request) {
        Section section = sectionRepository.findById(sectionId)
            .orElseThrow(() -> new RuntimeException("Section not found"));

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();
        if (!userRole.equals("ADMIN") && !section.getCourse().getTeacherId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to create lesson in this course");
        }

        Integer orderIndex = request.getOrderIndex() != null ? Integer.valueOf(request.getOrderIndex()) : 0;
        Boolean isFreePreview = request.getIsFreePreview() != null ? request.getIsFreePreview() : false;

        Lesson.LessonBuilder lessonBuilder = Lesson.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .orderIndex(orderIndex)
            .isFreePreview(isFreePreview)
            .section(section);

            if (request.getVideoUrl() != null && !request.getVideoUrl().trim().isEmpty()) {
                YoutubeVideoInfoResponse ytInfo = youtubeService.getVideoInfo(request.getVideoUrl());
                lessonBuilder.youtubeVideoId(ytInfo.getYoutubeVideoId())
                             .videoUrl(request.getVideoUrl())
                             .thumbnailUrl(ytInfo.getThumbnailUrl())
                             .duration(ytInfo.getDuration());
            }

        return lessonRepository.save(lessonBuilder.build());
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
        
        if (request.getOrderIndex() != null) {
            lesson.setOrderIndex(Integer.valueOf(request.getOrderIndex()));
        }
        if (request.getIsFreePreview() != null) {
            lesson.setIsFreePreview(request.getIsFreePreview());
        }

        // Tích hợp YouTube API cho luồng Update
        // Chỉ gọi lại API nếu videoUrl được cập nhật bằng một link mới
        if (request.getVideoUrl() != null && !request.getVideoUrl().trim().isEmpty() 
            && !request.getVideoUrl().equals(lesson.getVideoUrl())) {
            
            YoutubeVideoInfoResponse ytInfo = youtubeService.getVideoInfo(request.getVideoUrl());
            lesson.setYoutubeVideoId(ytInfo.getYoutubeVideoId());
            lesson.setVideoUrl(request.getVideoUrl());
            lesson.setThumbnailUrl(ytInfo.getThumbnailUrl());
            lesson.setDuration(ytInfo.getDuration());
        }

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

    public void markLessonAsCompleted(Long lessonId) {
    Long currentUserId = SecurityUtils.getCurrentUserId();
    
    Lesson lesson = lessonRepository.findById(lessonId)
        .orElseThrow(() -> new RuntimeException("Lesson not found"));

    boolean alreadyCompleted = progressRepository.existsByUserIdAndLessonId(currentUserId, lessonId);
    
    if (!alreadyCompleted) {
        UserLessonProgress progress = UserLessonProgress.builder()
            .userId(currentUserId)
            .lesson(lesson)
            .isCompleted(true)
            .completedAt(LocalDateTime.now())
            .build();
        
        progressRepository.save(progress);
    }
}

    
    
}
