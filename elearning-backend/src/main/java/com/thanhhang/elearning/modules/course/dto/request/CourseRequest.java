package com.thanhhang.elearning.modules.course.dto.request;

import lombok.Data;

@Data
public class CourseRequest {
    private String title;
    private String description;
    private Double price;
    private Long categoryId; 
    private String imageUrl;
    private Long instructorId;
    private String language;
}