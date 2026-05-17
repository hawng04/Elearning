package com.thanhhang.elearning.modules.chat.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.thanhhang.elearning.modules.chat.document.ChatRoom;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    
    Optional<ChatRoom> findByCourseId(Long courseId);
    
}