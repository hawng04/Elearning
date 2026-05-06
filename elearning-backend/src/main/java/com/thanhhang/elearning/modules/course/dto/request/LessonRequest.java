package com.thanhhang.elearning.modules.course.dto.request;

import lombok.Data;

@Data
public class LessonRequest {
    private String title;
    private String content;
    private Integer orderIndex;
    private Boolean isFreePreview;
    private String videoUrl;
}
