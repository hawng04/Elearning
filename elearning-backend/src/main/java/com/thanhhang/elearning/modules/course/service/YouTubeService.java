package com.thanhhang.elearning.modules.course.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class YouTubeService {

    // Lấy API key từ file application.properties
    @Value("${youtube.api.key}")
    private String apiKey;

    public Map<String, String> getVideoInfo(String videoId) {
        // Đường dẫn API của YouTube
        String url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=" + videoId + "&key=" + apiKey;
        
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);
        
        Map<String, String> result = new HashMap<>();
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode items = root.path("items");
            
            if (items.isArray() && items.size() > 0) {
                JsonNode snippet = items.get(0).path("snippet");
                JsonNode contentDetails = items.get(0).path("contentDetails");
                
                // 1. Lấy Tiêu đề
                result.put("title", snippet.path("title").asText());
                
                // 2. Lấy Thumbnail (Lấy độ phân giải cao nhất cho đẹp)
                JsonNode thumbnails = snippet.path("thumbnails");
                if (thumbnails.has("maxres")) {
                    result.put("thumbnail", thumbnails.path("maxres").path("url").asText());
                } else {
                    result.put("thumbnail", thumbnails.path("high").path("url").asText());
                }
                
                // 3. Lấy thời lượng (Sẽ có dạng PT15M33S - 15 phút 33 giây)
                result.put("duration", contentDetails.path("duration").asText()); 
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy thông tin YouTube: " + e.getMessage());
        }
        
        return result;
    }
}