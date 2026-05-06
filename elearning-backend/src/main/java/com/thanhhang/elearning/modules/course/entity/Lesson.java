package com.thanhhang.elearning.modules.course.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lessons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "youtube_video_id", unique = true)  // Rất quan trọng
    private String youtubeVideoId;

    @Column(name = "video_url")
    private String videoUrl;           // full URL hoặc embed URL

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;       // Thêm cái này

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "duration")         // Giữ nguyên String (PT3M45S) hoặc đổi thành Integer (giây)
    private String duration;           // Hoặc Integer durationInSeconds;

    @Column(name = "is_free_preview")
    private Boolean isFreePreview = false;

    @Column(name = "order_index")
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    @JsonIgnore
    private Section section;
}
