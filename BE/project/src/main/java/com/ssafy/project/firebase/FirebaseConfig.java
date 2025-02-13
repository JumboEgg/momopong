package com.ssafy.project.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

// Firebase 초기화 설정 클래스
@Configuration
public class FirebaseConfig {
    private static final Logger logger = Logger.getLogger(FirebaseConfig.class.getName());

    @Value("${firebase.credentials}")
    private String firebaseCredentials;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                logger.info("Firebase 초기화 시작...");

                InputStream serviceAccount = new ByteArrayInputStream(firebaseCredentials.getBytes());

                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                logger.info("Firebase 초기화 완료 ✅");
            }

            // Firebase 메시징 테스트
            testFirebaseMessaging();

        } catch (Exception e) {
            logger.log(Level.SEVERE, "Firebase 초기화 실패 ❌", e);
            throw new RuntimeException(e);
        }
    }

    // Firebase 메시지 전송 테스트 (토큰 유효성 확인)
    private void testFirebaseMessaging() {
        try {
            String testToken = "테스트용_유효한_FCM_토큰_입력"; // 유효한 테스트용 토큰 입력
            Message message = Message.builder()
                    .setToken(testToken)
                    .putData("test", "ping")
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            logger.info("Firebase 메시지 테스트 성공 🎉 Response: " + response);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Firebase 메시지 테스트 실패 ❌", e);
        }
    }
}
