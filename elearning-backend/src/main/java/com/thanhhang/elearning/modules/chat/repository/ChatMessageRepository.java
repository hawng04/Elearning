package com.thanhhang.elearning.modules.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.thanhhang.elearning.modules.chat.document.ChatMessage;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    
    List<ChatMessage> findByCourseIdOrderByTimestampAsc(Long courseId);
}