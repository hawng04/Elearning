package com.thanhhang.elearning.modules.course.repository;

import java.lang.foreign.Linker.Option;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanhhang.elearning.modules.course.entity.Category;
import java.util.Optional;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
