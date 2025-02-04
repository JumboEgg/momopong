package com.ssafy.project.exception;

public class InvitationExpiredException extends RuntimeException {
    public InvitationExpiredException() {
        super();
    }

    public InvitationExpiredException(String message) {
        super(message);
    }

    public InvitationExpiredException(String message, Throwable cause) {
        super(message, cause);
    }
}
