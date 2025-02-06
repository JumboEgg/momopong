package com.ssafy.project.exception;
// 자식 4명 넘어가면 발생
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
