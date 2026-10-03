package com.supermandi.common.exception;

import com.supermandi.common.dto.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ApiErrorResponse response = new ApiErrorResponse(false, HttpStatus.NOT_FOUND.value(), ex.getMessage(), null, LocalDateTime.now(), request.getDescription(false));
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequestException(BadRequestException ex, WebRequest request) {
        ApiErrorResponse response = new ApiErrorResponse(false, HttpStatus.BAD_REQUEST.value(), ex.getMessage(), null, LocalDateTime.now(), request.getDescription(false));
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateResourceException(DuplicateResourceException ex, WebRequest request) {
        ApiErrorResponse response = new ApiErrorResponse(false, HttpStatus.CONFLICT.value(), ex.getMessage(), null, LocalDateTime.now(), request.getDescription(false));
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        ApiErrorResponse response = new ApiErrorResponse(false, HttpStatus.BAD_REQUEST.value(), "Validation Error", errors, LocalDateTime.now(), request.getDescription(false));
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        ApiErrorResponse response = new ApiErrorResponse(false, HttpStatus.FORBIDDEN.value(), ex.getMessage(), null, LocalDateTime.now(), request.getDescription(false));
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        ApiErrorResponse response = new ApiErrorResponse(false, HttpStatus.UNAUTHORIZED.value(), ex.getMessage(), null, LocalDateTime.now(), request.getDescription(false));
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        ApiErrorResponse response = new ApiErrorResponse(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage(), null, LocalDateTime.now(), request.getDescription(false));
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
