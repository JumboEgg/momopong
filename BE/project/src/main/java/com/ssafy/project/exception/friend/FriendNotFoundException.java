package com.ssafy.project.exception.friend;
// 친구를 찾을 수 없을 떄 ( DB 에 없을 때 )
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
