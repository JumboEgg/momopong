package com.ssafy.project.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cloudfront.CloudFrontUtilities;
import software.amazon.awssdk.services.cloudfront.model.CannedSignerRequest;
import software.amazon.awssdk.services.cloudfront.url.SignedUrl;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Instant;
import java.time.temporal.ChronoUnit;


@Service
@RequiredArgsConstructor
@Slf4j
public class AudioServiceImpl implements AudioService {

    @Value("${cloud.aws.cloudfront.domain}")
    private String domain;

    @Value("${cloud.aws.cloudfront.key-pair-id}")  // public key id
    private String keyPairId;

    @Value("${cloud.aws.cloudfront.private-key}")
    private String privateKeyContent;
    private File privateKeyFile;


    @PostConstruct
    public void init() {
        try {
            // 임시 파일 생성
            privateKeyFile = File.createTempFile("cloudfront-private-key", ".pem");
            privateKeyFile.deleteOnExit(); // 애플리케이션 종료시 삭제

            // 환경 변수의 \n을 실제 줄바꿈으로 변환
            String actualContent = privateKeyContent.replace("\\n", "\n");

            // 임시 파일에 내용 쓰기
            Files.writeString(
                    privateKeyFile.toPath(),
                    actualContent,
                    StandardCharsets.UTF_8
            );

            log.info("Private key 파일 생성 완료: {}", privateKeyFile.getAbsolutePath());


        } catch (Exception e) {
            log.error("Private key 초기화 실패: {}", e.getMessage(), e);
            throw new RuntimeException("Private key 초기화 실패: " + e.getMessage(), e);
        }
    }

    @Override
    public String getSignedUrl(String audioKey) throws Exception {
        CloudFrontUtilities cloudFrontUtilities = CloudFrontUtilities.create();
        Instant expirationDate = Instant.now().plus(7, ChronoUnit.DAYS);    //유효기간 7일

        String resourceUrl = domain + "/" + audioKey;

        CannedSignerRequest cannedRequest = CannedSignerRequest.builder()
                .resourceUrl(resourceUrl)
                .privateKey(privateKeyFile.toPath())  // 임시 파일 사용
                .keyPairId(keyPairId)
                .expirationDate(expirationDate)
                .build();

        SignedUrl signedUrl = cloudFrontUtilities.getSignedUrlWithCannedPolicy(cannedRequest);
        String url = signedUrl.url();
        log.info("Generated signed URL: {}", url);


        return url;
    }

}