package com.thanhhang.elearning.modules.course.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thanhhang.elearning.modules.course.dto.response.YoutubeVideoInfoResponse;

import java.util.HashMap;
import java.util.Map;


@Service
public class YouTubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public YoutubeVideoInfoResponse getVideoInfo(String input) {
        String videoId = extractVideoId(input);   // Hỗ trợ cả full URL

        String url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=" 
                     + videoId + "&key=" + apiKey;

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode item = root.path("items").get(0);

            if (item == null) {
                throw new RuntimeException("Video không tồn tại hoặc bị private");
            }

            JsonNode snippet = item.path("snippet");
            JsonNode contentDetails = item.path("contentDetails");

            String durationIso = contentDetails.path("duration").asText();
            int durationSeconds = parseIsoDuration(durationIso);

            return YoutubeVideoInfoResponse.builder()
                    .youtubeVideoId(videoId)
                    .title(snippet.path("title").asText())
                    .thumbnailUrl(getBestThumbnail(snippet.path("thumbnails")))
                    .duration(durationIso)
                    .durationInSeconds(durationSeconds)
                    .videoUrl("https://www.youtube.com/watch?v=" + videoId)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Không thể lấy thông tin video YouTube: " + e.getMessage());
        }
    }

    // === Helper methods ===
    private String extractVideoId(String url) {
        // Hỗ trợ nhiều dạng URL
        String regex = "(?:youtube(?:-nocookie)?\\.com/(?:[^/\\n\\s]+/\\S+/|(?:v|e(?:mbed)?)/|\\S*?[?&]v=)|youtu\\.be/)([a-zA-Z0-9_-]{11})";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(regex);
        java.util.regex.Matcher matcher = pattern.matcher(url);
        return matcher.find() ? matcher.group(1) : url; // fallback nếu truyền thẳng videoId
    }

    private int parseIsoDuration(String duration) {
        // PT3M45S -> giây
        java.time.Duration d = java.time.Duration.parse(duration);
        return (int) d.getSeconds();
    }

    private String getBestThumbnail(JsonNode thumbnails) {
        if (thumbnails.has("maxres")) return thumbnails.path("maxres").path("url").asText();
        if (thumbnails.has("high")) return thumbnails.path("high").path("url").asText();
        return thumbnails.path("medium").path("url").asText();
    }
}