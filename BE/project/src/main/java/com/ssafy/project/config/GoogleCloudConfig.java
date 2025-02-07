package com.ssafy.project.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "google.cloud.credentials")
@Getter
@Setter
public class GoogleCloudConfig {
    private String type;
    private String projectId;
    private String privateKeyId;
    private String privateKey;
    private String clientEmail;
    private String clientId;
    private String authUri;
    private String tokenUri;
    private String authProviderX509CertUrl;
    private String clientX509CertUrl;
    private String universeDomain;

    public GoogleCredentials getCredentials() throws IOException {
        Map<String, Object> credentialsMap = new HashMap<>();
        credentialsMap.put("type", type);
        credentialsMap.put("project_id", projectId);
        credentialsMap.put("private_key_id", privateKeyId);
        credentialsMap.put("private_key", privateKey);
        credentialsMap.put("client_email", clientEmail);
        credentialsMap.put("client_id", clientId);
        credentialsMap.put("auth_uri", authUri);
        credentialsMap.put("token_uri", tokenUri);
        credentialsMap.put("auth_provider_x509_cert_url", authProviderX509CertUrl);
        credentialsMap.put("client_x509_cert_url", clientX509CertUrl);
        credentialsMap.put("universe_domain", universeDomain);

        ObjectMapper mapper = new ObjectMapper();
        String credentialsJson = mapper.writeValueAsString(credentialsMap);

        return GoogleCredentials.fromStream(
                new ByteArrayInputStream(credentialsJson.getBytes())
        );
    }
}