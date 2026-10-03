package com.supermandi.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ChatRequest(
        String prompt,
        String message,
        String text,
        String query,
        List<ChatMessage> history,
        Attachment attachment
) {
    public String getEffectivePrompt() {
        if (prompt != null && !prompt.isBlank()) return prompt;
        if (message != null && !message.isBlank()) return message;
        if (text != null && !text.isBlank()) return text;
        if (query != null && !query.isBlank()) return query;
        return "Hello";
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ChatMessage(String role, String content, String text) {
        public String getEffectiveContent() {
            if (content != null && !content.isBlank()) return content;
            if (text != null && !text.isBlank()) return text;
            return "";
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Attachment(String data, String mimeType) {}
}
