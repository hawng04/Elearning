package com.thanhhang.elearning.modules.course.dto.response;

import java.util.List;

import com.thanhhang.elearning.modules.course.entity.Section;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private Long instructorId;
    private Double price;
    private String status;
    private String categoryName;
    private List<SectionResponse> sections;
    
    private Double rating;
    private Integer totalRatings;
    private Integer totalStudents;
    private String language;
    private String lastUpdated;
    private List<String> benefits;     
    private List<String> requirements; 
    private List<String> includes;
}
