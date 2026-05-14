package com.thanhhang.elearning.modules.chat.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "chat_messages") 
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    
    @Id 
    private String id; 

    private Long courseId; 
    private Long senderId; 
    private String senderName; 
    
    private String content;
    private LocalDateTime timestamp;
}