package com.thanhhang.elearning.modules.enrollment.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Builder
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "course_id")
    private Long courseId;

    @Column(nullable = false, name = "student_id")
    private Long studentId;

    @Column(name = "enrollment_date")
    private LocalDateTime enrollmentDate;

    private String status; //  ENROLLED, COMPLETED, DROPPED




    
}
