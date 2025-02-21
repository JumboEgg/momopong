package com.ssafy.project.exception.friend;
// 잘못된 친구요청에 대한 예외처리
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
