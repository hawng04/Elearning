package com.thanhhang.elearning.modules.enrollment.entity;

import java.time.LocalDateTime;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lesson_progress")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LessonProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;
    
    @Column(name = "lesson_id", nullable = false)
    private Long lessonId; 

    @Column(name = "is_completed")
    private boolean isCompleted; 

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    
}
