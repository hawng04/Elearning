package com.thanhhang.elearning.modules.enrollment.dto;

import java.time.LocalDateTime;
import com.thanhhang.elearning.modules.course.entity.Course;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EnrollmentResponseDTO {
    private Long id; 
    private Long courseId;
    private LocalDateTime enrollmentDate;
    private String status;
    
    private Course course; 
    
    private Integer progress; 
}