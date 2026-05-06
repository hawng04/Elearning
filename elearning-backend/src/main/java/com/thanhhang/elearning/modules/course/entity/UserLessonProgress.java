package com.thanhhang.elearning.modules.course.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_lesson_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "lesson_id"}) // Đảm bảo 1 user không lưu trùng 1 bài học
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // Lưu ID của học viên

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}