package com.ssafy.project.exception;
// 초대 만료되었을 떄
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
