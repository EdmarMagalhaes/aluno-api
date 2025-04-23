package com.exemplo.alunoapi.exception;

import java.time.LocalDateTime;

public class ErroResposta {
    private LocalDateTime timestamp;
    private int status;
    private String error;

    public ErroResposta(int status, String error) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
    }

    // Getters e Setters
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }
}