package com.thanhhang.elearning.modules.chat.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "chat_rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    
    @Id
    private String id;
    
    private Long courseId; 
    
    private String roomName;
    
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    
    private LocalDateTime createdAt;
}