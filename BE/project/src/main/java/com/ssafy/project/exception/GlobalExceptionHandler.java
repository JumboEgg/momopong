package com.ssafy.project.exception;

import com.ssafy.project.exception.friend.AlreadyAcceptedException;
import com.ssafy.project.exception.friend.FriendNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errors);
    }

    // 토큰 관련 예외
    @ExceptionHandler({InvalidTokenException.class, JwtAuthenticationException.class})
    public ResponseEntity<String> handleInvalidateTokenException(Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다: " + e.getMessage());
    }

    // 리소스를 찾을 수 없는 예외
    @ExceptionHandler({UserNotFoundException.class, FriendNotFoundException.class})
    public ResponseEntity<String> handleNotFoundException(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("리소스를 찾을 수 없습니다: " + e.getMessage());
    }

    // 잘못된 요청
    @ExceptionHandler({IllegalArgumentException.class, ChildLimitExceededException.class})
    public ResponseEntity<String> handleBadRequestException(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청입니다: " + e.getMessage());
    }

    // 접근 권한 없음
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<String> handleDisabledException(DisabledException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    }

    // 중복 요청
    @ExceptionHandler({DuplicateParentEmailException.class, AlreadyAcceptedException.class})
    public ResponseEntity<String> handleConflictException(Exception e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 처리된 요청입니다: " + e.getMessage());
    }
}
