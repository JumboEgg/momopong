package com.ssafy.project.exception;

public class JwtAuthenticationException extends RuntimeException {
    public JwtAuthenticationException() {
        super();
    }

    public JwtAuthenticationException(String message) {
        super(message);
    }

    public JwtAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}
