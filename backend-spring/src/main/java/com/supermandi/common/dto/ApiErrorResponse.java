package com.supermandi.common.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ApiErrorResponse(
    boolean success,
    int status,
    String message,
    List<String> errors,
    LocalDateTime timestamp,
    String path
) {}
