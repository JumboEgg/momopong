package com.ssafy.project.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;

// Firebase 초기화 설정 클래스
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initalize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                ClassPathResource resource = new ClassPathResource("firebase/d103-952ab-firebase-adminsdk-fbsvc-68e87c57be.json");
                FileInputStream serviceAccount = new FileInputStream(resource.getFile());
                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
