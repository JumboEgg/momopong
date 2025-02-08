package com.ssafy.project.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.util.Base64;

@Component
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                String firebaseConfigBase64 = System.getenv("FIREBASE_CONFIG");

                // Base64 디코딩 후 Firebase 초기화
                byte[] decodedBytes = Base64.getDecoder().decode(firebaseConfigBase64);
                ByteArrayInputStream serviceAccount = new ByteArrayInputStream(decodedBytes);
                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            throw new RuntimeException("Firebase 초기화 실패", e);
        }
    }
}
