package com.thanhhang.elearning.modules.course.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thanhhang.elearning.modules.course.dto.response.YoutubeVideoInfoResponse;
import com.thanhhang.elearning.modules.course.service.YouTubeService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/youtube")
@CrossOrigin("*") 
public class YouTubeController {

    @Autowired
    private YouTubeService youtubeService;

    @GetMapping("/info")
    public ResponseEntity<YoutubeVideoInfoResponse> getVideoInfo(@RequestParam String urlOrId) {
        return ResponseEntity.ok(youtubeService.getVideoInfo(urlOrId));
    }
}
