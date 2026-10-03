package com.supermandi.ai;

public record ChatResponse(
        String reply,
        String answer,
        String response
) {
    public ChatResponse(String text) {
        this(text, text, text);
    }
}
