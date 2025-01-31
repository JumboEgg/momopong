package com.ssafy.project.exception.friend;

public class IllegalFriendRequestException extends RuntimeException {
    public IllegalFriendRequestException() {
        super();
    }

    public IllegalFriendRequestException(String message) {
        super(message);
    }

    public IllegalFriendRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
