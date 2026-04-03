package com.thanhhang.elearning.modules.iam.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanhhang.elearning.modules.iam.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    List<User> findAllByActiveTrue();
    Optional<User> findByEmailAndActiveTrue(String email);
} 