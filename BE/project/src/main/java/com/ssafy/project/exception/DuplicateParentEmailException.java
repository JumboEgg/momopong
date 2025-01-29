package com.ssafy.project.exception;

public class DuplicateParentEmailException extends RuntimeException {

    public DuplicateParentEmailException() {
        super();
    }

    public DuplicateParentEmailException(String message) {
        super(message);
    }

    public DuplicateParentEmailException(String message, Throwable cause) {
        super(message, cause);
    }
}
