package com.ssafy.project.exception;

public class ParentNotFoundException extends RuntimeException {
    public ParentNotFoundException() {
        super();
    }

    public ParentNotFoundException(String message) {
        super(message);
    }

    public ParentNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
