package com.supermandi.ai;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
@Tag(name = "AI Assistant")
public class AiController {

    private final AiService aiService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest req) {
        String reply = aiService.chat(req);
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
