package com.ssafy.project.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.ssafy.project.dto.FileDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PresignedUrlService {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private static String file = "%s/%s.%s";

    // Presigned URL - PUT
    public FileDto getPresignedUrl(String folder, String extension) {
        String fileName = String.format(file, folder, UUID.randomUUID(), extension);

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucket, fileName)
                        .withMethod(HttpMethod.PUT)
                        .withExpiration(DateTime.now().plusMinutes(5).toDate());

        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);

        return FileDto.builder()
                .presignedUrl(url.toString())
                .fileName(fileName)
                .build();
    }

    // Presigned URL - GET
    public String getFile(String fileName) {
        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, fileName)
                .withMethod(HttpMethod.GET)
                .withExpiration(DateTime.now().plusDays(1).toDate());

        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        log.info("url={}", url.toString());
        return url.toString();
    }
}
