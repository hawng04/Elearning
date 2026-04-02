package com.thanhhang.elearning.modules.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanhhang.elearning.modules.course.entity.Section;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {

    
}
