package com.thanhhang.elearning.modules.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class YoutubeVideoInfoResponse {
    private String youtubeVideoId;
    private String title;
    private String thumbnailUrl;
    private String duration;          
    private Integer durationInSeconds;
    private String videoUrl;
}