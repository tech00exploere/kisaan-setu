package com.supermandi.ai;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Concrete implementation of AiService integrating Gemini API with fallback support.
 */
@Slf4j
@Service
public class AiServiceImpl implements AiService {

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    @Value("${app.gemini.models:gemini-2.5-flash,gemini-2.0-flash,gemini-1.5-flash}")
    private String modelsConfig;

    private RestClient restClient;
    private List<String> models;

    @PostConstruct
    public void init() {
        this.restClient = RestClient.create();
        if (modelsConfig != null && !modelsConfig.isBlank()) {
            this.models = List.of(modelsConfig.split(","));
        } else {
            this.models = List.of("gemini-2.5-flash", "gemini-2.0-flash");
        }
    }

    @Override
    public String chat(ChatRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Gemini API key is not configured.");
            return "Gemini AI assistant is not fully configured. Please set GEMINI_API_KEY environment variable.";
        }

        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();

        if (request.history() != null) {
            for (ChatRequest.ChatMessage msg : request.history()) {
                if (msg == null) continue;
                String msgContent = msg.getEffectiveContent();
                if (msgContent == null || msgContent.isBlank()) continue;
                String role = "assistant".equalsIgnoreCase(msg.role()) ? "model" : "user";
                contents.add(Map.of(
                        "role", role,
                        "parts", List.of(Map.of("text", msgContent))
                ));
            }
        }

        List<Map<String, Object>> currentParts = new ArrayList<>();
        String userPrompt = request.getEffectivePrompt();
        currentParts.add(Map.of("text", userPrompt));

        if (request.attachment() != null && request.attachment().data() != null && request.attachment().mimeType() != null) {
            String base64Data = request.attachment().data();
            if (base64Data.contains(",")) {
                base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
            }
            currentParts.add(Map.of(
                    "inlineData", Map.of(
                            "mimeType", request.attachment().mimeType(),
                            "data", base64Data
                    )
            ));
        }

        contents.add(Map.of(
                "role", "user",
                "parts", currentParts
        ));

        requestBody.put("contents", contents);

        for (String model : models) {
            try {
                String modelName = model.trim();
                String url = String.format("https://generativelanguage.googleapis.com/v1/models/%s:generateContent?key=%s", modelName, apiKey);

                Map response = restClient.post()
                        .uri(url)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

                if (response != null && response.containsKey("candidates")) {
                    List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                        if (content != null) {
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                String replyText = (String) parts.get(0).get("text");
                                if (replyText != null && !replyText.isBlank()) {
                                    log.info("Gemini AI response successfully received using model {}", modelName);
                                    return replyText;
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Gemini API call failed for model {}: {}", model, e.getMessage());
            }
        }

        return "I am currently unable to get a response from Gemini. Please try again in a few moments.";
    }
}
