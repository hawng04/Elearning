package com.thanhhang.elearning.modules.course.dto.response;

import java.util.List;

import com.thanhhang.elearning.modules.course.entity.Section;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseDto {
    private Long courseId;
    private String title;
    private String description;
    private String imageUrl;
    private Long teacherId;
    private List<Section> sections;
    
}
