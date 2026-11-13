package com.nganu.delivery_dash.exception;

import com.nganu.delivery_dash.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Menangkap error validasi dari anotasi @Valid di Controller (DTO Validation).
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        // Ekstraksi pesan error: Mengambil pesan error dari field pertama yang gagal
        // divalidasi.
        // Jika ada banyak field yang salah, kita ambil yang urutan pertama agar user
        // tidak pusing.
        String errorMessage = "Validasi gagal";
        FieldError firstError = ex.getBindingResult().getFieldError();
        if (firstError != null) {
            errorMessage = firstError.getDefaultMessage();
        }

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(errorMessage)
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Menangkap error logika bisnis yang dilempar dari GameApiService (404 Not
     * Found, 403 Forbidden, dll).
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(
            ResponseStatusException ex, HttpServletRequest request) {

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(ex.getStatusCode().value())
                .error(((HttpStatus) ex.getStatusCode()).getReasonPhrase())
                .message(ex.getReason()) // Mengambil pesan spesifik yang kita set di Service
                .path(request.getRequestURI())
                .build();

        return new ResponseEntity<>(errorResponse, ex.getStatusCode());
    }

    /**
     * Fallback pengaman: Menangkap error server yang tidak terduga
     * (NullPointerException, Database down, dll).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, HttpServletRequest request) {

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message("Terjadi kesalahan internal pada server") // Pesan aman agar struktur DB tidak bocor
                .path(request.getRequestURI())
                .build();

        // Anda bisa menambahkan logger (log.error("Internal Server Error", ex)) di sini
        // untuk debugging backend

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}