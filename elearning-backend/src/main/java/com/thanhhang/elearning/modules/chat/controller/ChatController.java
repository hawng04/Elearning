package com.thanhhang.elearning.modules.chat.controller;

import com.thanhhang.elearning.modules.chat.document.ChatMessage;
import com.thanhhang.elearning.modules.chat.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.time.LocalDateTime;

@Controller
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chat/{courseId}")
    @SendTo("/topic/messages/{courseId}")
    public ChatMessage sendMessage(@DestinationVariable Long courseId, ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        message.setCourseId(courseId);
        return chatMessageRepository.save(message);
    }
}