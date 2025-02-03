package com.ssafy.project.exception.friend;

public class AlreadyAcceptedException extends RuntimeException {
    public AlreadyAcceptedException() {
        super();
    }

    public AlreadyAcceptedException(String message) {
        super(message);
    }

    public AlreadyAcceptedException(String message, Throwable cause) {
        super(message, cause);
    }
}
