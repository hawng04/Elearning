package com.thanhhang.elearning.modules.chat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanhhang.elearning.modules.chat.document.ChatMessage;
import com.thanhhang.elearning.modules.chat.repository.ChatMessageRepository;

@RestController
@RequestMapping("/api/chat")
public class ChatHistoryController {
    @Autowired
    private ChatMessageRepository repository;

    @GetMapping("/{courseId}")
    public List<ChatMessage> getHistory(@PathVariable Long courseId) {
        return repository.findByCourseIdOrderByTimestampAsc(courseId);
    }
}