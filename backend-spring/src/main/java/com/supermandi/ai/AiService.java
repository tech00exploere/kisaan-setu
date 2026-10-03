package com.supermandi.ai;

/**
 * AI Service Interface (DIP / ISP).
 */
public interface AiService {

    String chat(ChatRequest request);
}
