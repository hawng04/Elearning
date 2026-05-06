package com.thanhhang.elearning.modules.course.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thanhhang.elearning.modules.course.service.YouTubeService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/youtube")
@CrossOrigin("*") // Nhớ thêm cái này nếu gọi từ Next.js localhost:3000 bị lỗi CORS
public class YouTubeController {

    @Autowired
    private YouTubeService youtubeService;

    @GetMapping("/info")
    public ResponseEntity<?> getYouTubeInfo(@RequestParam String videoId) {
        Map<String, String> info = youtubeService.getVideoInfo(videoId);
        
        if(info.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy video hoặc Link không hợp lệ");
        }
        
        return ResponseEntity.ok(info);
    }
}
