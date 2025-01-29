package com.ssafy.project.exception;

public class ChildLimitExceededException extends RuntimeException {
    public ChildLimitExceededException() {
        super();
    }

    public ChildLimitExceededException(String message) {
        super(message);
    }

    public ChildLimitExceededException(String message, Throwable cause) {
        super(message, cause);
    }
}
