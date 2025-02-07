package com.ssafy.project.exception.friend;
// 이미 수락된 친구요청에 대한 예외처리
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
