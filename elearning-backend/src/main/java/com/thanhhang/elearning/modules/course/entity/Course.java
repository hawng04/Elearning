package com.thanhhang.elearning.modules.course.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(length = 50)
    private String status; 


    @Column(name = "instructor_id", nullable = false)
    private Long instructorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;


    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Section> sections;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "total_ratings")
    private Integer totalRatings;

    @Column(name = "total_students")
    private Integer totalStudents;

    private String language;
    
    @Column(name = "last_updated")
    private String lastUpdated;

    @ElementCollection
    @CollectionTable(name = "course_benefits", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "benefit", columnDefinition = "TEXT")
    private List<String> benefits;

    @ElementCollection
    @CollectionTable(name = "course_requirements", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "requirement", columnDefinition = "TEXT")
    private List<String> requirements;

    @ElementCollection
    @CollectionTable(name = "course_includes", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "include_item", columnDefinition = "TEXT")
    private List<String> includes;
}