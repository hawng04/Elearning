package com.thanhhang.elearning.modules.course.service;

import java.security.Security;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.catalina.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.common.utils.SecurityUtils;
import com.thanhhang.elearning.modules.course.dto.request.CourseRequest;
import com.thanhhang.elearning.modules.course.dto.response.CourseResponse;
import com.thanhhang.elearning.modules.course.dto.response.LessonResponse;
import com.thanhhang.elearning.modules.course.dto.response.SectionResponse;
import com.thanhhang.elearning.modules.course.entity.Category;
import com.thanhhang.elearning.modules.course.entity.Course;
import com.thanhhang.elearning.modules.course.repository.CategoryRepository;
import com.thanhhang.elearning.modules.course.repository.CourseRepository;
import com.thanhhang.elearning.modules.enrollment.repository.EnrollmentRepository;
import com.thanhhang.elearning.modules.enrollment.repository.LessonProgressRepository;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonProgressRepository progressRepository;


    public Course createCourse(CourseRequest request) {
        
        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();

        Long finalinstructorId = currentUserId;

        if (request.getInstructorId() != null && userRole.equals("ADMIN")) {
            finalinstructorId = request.getInstructorId();
        }

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        Course course = Course.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .price(request.getPrice())
            .imageUrl(request.getImageUrl())
            .language(request.getLanguage())
            .status("DRAFT")
            .category(category)
            .instructorId(finalinstructorId)
            .build();

        return courseRepository.save(course);
    }

    public Course updateCourse(Long courseId, CourseRequest request) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();

        if (!course.getInstructorId().equals(currentUserId) && !userRole.equals("ADMIN")) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa khóa học này");
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setImageUrl(request.getImageUrl());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
            course.setCategory(category);
        }
        return courseRepository.save(course);
    }

    public CourseResponse getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        Long currentUserId = null;
        String userRole = "GUEST";
        boolean isEnrolled = false;

        try {
            currentUserId = SecurityUtils.getCurrentUserId();
            userRole = SecurityUtils.getCurrentUserRole();
        } catch (Exception e) {
            // Không làm gì cả, user chưa đăng nhập (GUEST)
        }

        if (currentUserId != null) {
            isEnrolled = enrollmentRepository.existsByCourseIdAndStudentId(courseId, currentUserId);
        }

        boolean hasFullAccess = (currentUserId != null && currentUserId.equals(course.getInstructorId())) 
                                || "ADMIN".equals(userRole) 
                                || isEnrolled;


        List<SectionResponse> sectionResponses = course.getSections().stream().map(section -> {
            
            List<LessonResponse> lessonResponses = section.getLessons().stream().map(lesson -> {
                
                String videoIdToReturn = lesson.getYoutubeVideoId();
                String videoUrlToReturn = lesson.getVideoUrl();
                
                if (!hasFullAccess && (lesson.getIsFreePreview() == null || !lesson.getIsFreePreview())) {
                    videoIdToReturn = null; 
                    videoUrlToReturn = null;
                }

                return LessonResponse.builder()
                        .id(lesson.getId())
                        .title(lesson.getTitle())
                        .youtubeVideoId(videoIdToReturn) 
                        .videoUrl(videoUrlToReturn)     
                        .thumbnailUrl(lesson.getThumbnailUrl())
                        .content(lesson.getContent())
                        .duration(lesson.getDuration())
                        .isFreePreview(lesson.getIsFreePreview())
                        .orderIndex(lesson.getOrderIndex())
                        .sectionId(section.getId())
                        .build();
            }).collect(Collectors.toList());

            return SectionResponse.builder()
                    .id(section.getId())
                    .title(section.getTitle())
                    .orderIndex(section.getOrderIndex())
                    .lessons(lessonResponses) 
                    .build();
                    
        }).collect(Collectors.toList());

        return CourseResponse.builder()
            .id(course.getId())
            .title(course.getTitle())
            .description(course.getDescription())
            .imageUrl(course.getImageUrl())
            .instructorId(course.getInstructorId())
            .price(course.getPrice())
            .status(course.getStatus())
            .categoryName(course.getCategory().getName())
            .sections(sectionResponses) // <--- Thay vì course.getSections(), ta trả về DTO an toàn
            .rating(course.getAverageRating() != null ? course.getAverageRating() : 0.0)
            .totalRatings(course.getTotalRatings() != null ? course.getTotalRatings() : 0)
            .totalStudents(course.getTotalStudents() != null ? course.getTotalStudents() : 0)
            .language(course.getLanguage() != null ? course.getLanguage() : "Tiếng Việt")
            .lastUpdated(course.getLastUpdated() != null ? course.getLastUpdated() : "3/2026")
            .benefits(course.getBenefits() != null ? course.getBenefits() : new ArrayList<>())
            .requirements(course.getRequirements() != null ? course.getRequirements() : new ArrayList<>())
            .includes(course.getIncludes() != null ? course.getIncludes() : new ArrayList<>())
            .build();
    
        
    }

    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        Long currentUserId = SecurityUtils.getCurrentUserId();
        String userRole = SecurityUtils.getCurrentUserRole();

        if (!course.getInstructorId().equals(currentUserId) && !userRole.equals("ADMIN")) {
            throw new RuntimeException("Bạn không có quyền xóa khóa học này");
        }

        courseRepository.delete(course);
    }

    public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        
        return courses.stream().map(course -> CourseResponse.builder()
            .id(course.getId())
            .title(course.getTitle())
            .description(course.getDescription())
            .imageUrl(course.getImageUrl())
            .instructorId(course.getInstructorId())
            .price(course.getPrice())
            .status(course.getStatus())
            .categoryName(course.getCategory().getName())
            .rating(course.getAverageRating() != null ? course.getAverageRating() : 0.0)
            .totalRatings(course.getTotalRatings() != null ? course.getTotalRatings() : 0)
            .totalStudents(course.getTotalStudents() != null ? course.getTotalStudents() : 0)
            .language(course.getLanguage() != null ? course.getLanguage() : "Tiếng Việt")
            .lastUpdated(course.getLastUpdated() != null ? course.getLastUpdated() : "3/2026")
            .benefits(course.getBenefits() != null ? course.getBenefits() : new ArrayList<>())
            .requirements(course.getRequirements() != null ? course.getRequirements() : new ArrayList<>())
            .includes(course.getIncludes() != null ? course.getIncludes() : new ArrayList<>())
            .build()).collect(Collectors.toList());
    }

    public long getTotalLessonsInCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        return course.getSections().stream()
            .flatMap(section -> section.getLessons().stream())
            .count();
    }

    public java.util.List<Long> getCompletedLessonIds(Long courseId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return progressRepository.findCompletedLessonIds(currentUserId, courseId);
    }

    public List<CourseResponse> getMyTeachingCourses() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        
        List<Course> courses = courseRepository.findByInstructorId(currentUserId);
        
        return courses.stream().map(course -> CourseResponse.builder()
            .id(course.getId())
            .title(course.getTitle())
            .description(course.getDescription())
            .imageUrl(course.getImageUrl())
            .instructorId(course.getInstructorId())
            .price(course.getPrice())
            .status(course.getStatus())
            .categoryName(course.getCategory() != null ? course.getCategory().getName() : null)
            .rating(course.getAverageRating() != null ? course.getAverageRating() : 0.0)
            .totalRatings(course.getTotalRatings() != null ? course.getTotalRatings() : 0)
            .totalStudents(course.getTotalStudents() != null ? course.getTotalStudents() : 0)
            .language(course.getLanguage() != null ? course.getLanguage() : "Tiếng Việt")
            .lastUpdated(course.getLastUpdated() != null ? course.getLastUpdated() : "3/2026")
            .build()).collect(Collectors.toList());
    }
    
}
