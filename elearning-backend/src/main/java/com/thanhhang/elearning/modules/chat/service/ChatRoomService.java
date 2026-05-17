package com.thanhhang.elearning.modules.chat.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thanhhang.elearning.modules.chat.document.ChatRoom;
import com.thanhhang.elearning.modules.chat.repository.ChatRoomRepository;
import com.thanhhang.elearning.modules.course.entity.Course;
import com.thanhhang.elearning.modules.course.repository.CourseRepository; // Query bên MySQL

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository; 

    @Autowired
    private CourseRepository courseRepository;

    public ChatRoom getOrCreateRoom(Long courseId) {
        
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByCourseId(courseId);
        if (existingRoom.isPresent()) {
            return existingRoom.get(); 
        }

        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy khóa học với ID " + courseId));

        ChatRoom newRoom = ChatRoom.builder()
            .courseId(course.getId()) 
            .roomName("Thảo luận: " + course.getTitle()) 
            .createdAt(LocalDateTime.now())
            .build();

        return chatRoomRepository.save(newRoom);
    }
}