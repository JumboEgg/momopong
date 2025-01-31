package com.ssafy.project.exception.friend;

public class FriendNotFoundException extends RuntimeException {
    public FriendNotFoundException() {
        super();
    }

    public FriendNotFoundException(String message) {
        super(message);
    }

    public FriendNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
