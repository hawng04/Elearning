package com.thanhhang.elearning.modules.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponse {

    private Long id;
    private String title;
    private String youtubeVideoId;
    private String videoUrl;
    private String thumbnailUrl;
    private String content;
    private String duration;           
    private Boolean isFreePreview;
    private Integer orderIndex;
    private Long sectionId;

    private String durationFormatted;  
    private String youtubeEmbedUrl;    
}