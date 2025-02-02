package com.ssafy.project.handler;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.api.gax.rpc.ApiStreamObserver;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
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

@Slf4j
@Component
public class WebSocketHandler extends TextWebSocketHandler {
    private SpeechClient speechClient;
    private final LetterService letterService;
    private ApiStreamObserver<StreamingRecognizeRequest> requestObserver;

    @Autowired
    public WebSocketHandler(LetterService letterService) {
        this.letterService = letterService;
    }

    @PostConstruct
    public void initializeSpeechClient() {
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    getClass().getResourceAsStream("/ssafy-fairytale-43a2757e76e7.json")
            );
            SpeechSettings settings = SpeechSettings.newBuilder()
                    .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                    .build();

            this.speechClient = SpeechClient.create(settings);
        } catch (IOException e) {
            log.error("Failed to create SpeechClient", e);
            throw new RuntimeException("Could not initialize SpeechClient", e);
        }
    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("WebSocket connection established.");

        ApiStreamObserver<StreamingRecognizeResponse> responseObserver = new ApiStreamObserver<StreamingRecognizeResponse>() {
            @Override
            public void onNext(StreamingRecognizeResponse response) {
                try {
                    if (response.getResultsCount() > 0) {
                        StreamingRecognitionResult result = response.getResults(0);
                        String transcript = result.getAlternatives(0).getTranscript();

                        // 최종 결과일 때만 isFinal true로 전송
                        session.sendMessage(new TextMessage(
                                String.format(
                                        "{\"transcript\": \"%s\", \"isFinal\": %b}",
                                        transcript, result.getIsFinal()
                                )
                        ));
                    }
                } catch (Exception e) {
                    log.error("Error in handling response", e);
                }
            }



            @Override
            public void onError(Throwable t) {
                System.err.println("Error: " + t.getMessage());
                try {
                    session.sendMessage(new TextMessage("{\"error\": \"" + t.getMessage() + "\"}"));
                } catch (IOException e) {
                    e.printStackTrace();
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

//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        try {
//            System.out.println("Received message: " + message.getPayload());
//
//            RecognitionConfig config = RecognitionConfig.newBuilder()
//                    .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
//                    .setSampleRateHertz(16000)
//                    .setLanguageCode("ko-KR")
//                    .build();
//
//            RecognitionAudio audio = RecognitionAudio.newBuilder()
//                    .setContent(ByteString.copyFrom(message.getPayload().getBytes()))
//                    .build();
//
//            RecognizeResponse response = speechClient.recognize(config, audio);
//            System.out.print("api 요청");
//            SpeechRecognitionResult result = response.getResultsList().get(0);
//            String transcript = result.getAlternativesList().get(0).getTranscript();
//
//            session.sendMessage(new TextMessage(transcript));
//        }catch (Exception e) {
//            e.printStackTrace();
//            System.out.println("Error processing message: " + e.getMessage());
//        }
//    }
}