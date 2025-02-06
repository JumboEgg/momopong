package com.ssafy.project.handler;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.api.gax.rpc.ApiStreamObserver;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import com.ssafy.project.config.GoogleCloudConfig;
import com.ssafy.project.service.LetterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.annotation.PostConstruct;
import java.io.IOException;
// STT 관련 , 소켓 설정
@Slf4j
@Component("sttWebSocketHandler")
public class WebSocketHandler extends TextWebSocketHandler {

    private final GoogleCloudConfig googleCloudConfig;
    private SpeechClient speechClient;
    private final LetterService letterService;
    private ApiStreamObserver<StreamingRecognizeRequest> requestObserver;

    @Autowired
    public WebSocketHandler(GoogleCloudConfig googleCloudConfig, LetterService letterService) {
        this.googleCloudConfig = googleCloudConfig;
        this.letterService = letterService;
    }
    // 초기화
    @PostConstruct
    public void initializeSpeechClient() {
        try {
            GoogleCredentials credentials = googleCloudConfig.getCredentials();
            SpeechSettings settings = SpeechSettings.newBuilder()
                    .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                    .build();

            this.speechClient = SpeechClient.create(settings);
        } catch (IOException e) {
            log.error("Failed to create SpeechClient", e);
            throw new RuntimeException("Could not initialize SpeechClient", e);
        }
    }
    // 클라이언트에게
    private void sendMessageToClient(WebSocketSession session, String message) {
        try {
            // 세션이 열려있는지 확인
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            } else {
                log.warn("WebSocket session is closed. Message not sent.");
            }
        } catch (IOException e) {
            log.error("Error sending message through WebSocket", e);
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("WebSocket connection established.");

        ApiStreamObserver<StreamingRecognizeResponse> responseObserver = new ApiStreamObserver<StreamingRecognizeResponse>() {
            @Override
            public void onNext(StreamingRecognizeResponse response) {
                try {

                    if (!session.isOpen()) {
                        log.warn("WebSocket session is closed. Skipping message processing.");
                        return;
                    }

                    if (response.getResultsCount() > 0) {
                        StreamingRecognitionResult result = response.getResults(0);
                        String transcript = result.getAlternatives(0).getTranscript();

                        // 최종 결과일 때만 isFinal true로 전송
                        try {
                            // JSON 형식의 응답 생성
                            String jsonResponse = String.format(
                                    "{\"transcript\": \"%s\", \"isFinal\": %b}",
                                    transcript.replace("\"", "\\\""), // 특수문자 이스케이프
                                    result.getIsFinal()
                            );

                            sendMessageToClient(session, jsonResponse);
                        } catch (Exception e) {
                            log.error("Error sending message to client", e);
                        }
                    }
                } catch (Exception e) {
                    log.error("Error in handling response", e);
                }
            }



            @Override
            public void onError(Throwable t) {
                log.error("Streaming error occurred", t);
                try {
                    if (session.isOpen()) {
                        String errorMessage = String.format(
                                "{\"error\": \"%s\"}",
                                t.getMessage().replace("\"", "\\\"")
                        );
                        sendMessageToClient(session, errorMessage);
                    }
                } catch (Exception e) {
                    log.error("Error sending error message to client", e);
                }
            }

            @Override
            public void onCompleted() {

                System.out.println("Streaming completed.");
            }
        };



        requestObserver = speechClient.streamingRecognizeCallable().bidiStreamingCall(responseObserver);

        // 초기 설정 전송
        StreamingRecognizeRequest configRequest = StreamingRecognizeRequest.newBuilder()
                .setStreamingConfig(StreamingRecognitionConfig.newBuilder()
                        .setConfig(RecognitionConfig.newBuilder()
                                .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
                                .setSampleRateHertz(16000)
                                .setLanguageCode("ko-KR")
                                .build())
                        .setInterimResults(true)
                        .build())
                .build();

        requestObserver.onNext(configRequest);
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        if (requestObserver != null) {
            StreamingRecognizeRequest audioRequest = StreamingRecognizeRequest.newBuilder()
                    .setAudioContent(ByteString.copyFrom(message.getPayload().array()))
                    .build();
            requestObserver.onNext(audioRequest);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        System.out.println("WebSocket connection closed.");
        if (requestObserver != null) {
            requestObserver.onCompleted();
        }
    }


}