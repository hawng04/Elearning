package com.thanhhang.elearning.modules.course.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionResponse {
    private Long id;
    private String title;
    private Integer orderIndex;
    
    private List<LessonResponse> lessons; 
}
