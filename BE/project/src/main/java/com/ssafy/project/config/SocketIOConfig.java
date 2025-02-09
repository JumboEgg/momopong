package com.ssafy.project.config;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.Transport;
import com.ssafy.project.dto.DrawingDto;
import org.springframework.context.annotation.Bean;
// 서브 컨텐츠 , 그림 그리기 소켓
@org.springframework.context.annotation.Configuration
public class SocketIOConfig {
    @Bean
    public SocketIOServer socketIOServer() {
        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(3869);  // 포트번호 확인
        config.setOrigin("*");  // 모든 출처 허용
        config.setAllowCustomRequests(true);

        // 추가 설정
        config.setUpgradeTimeout(10000);
        config.setPingTimeout(60000);
        config.setPingInterval(25000);
        config.setTransports(Transport.WEBSOCKET, Transport.POLLING);  // 둘 다 허용

        SocketIOServer server = new SocketIOServer(config);

        // 기본 이벤트 리스너 (연결 로그)
        server.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
            System.out.println("Transport: " + client.getTransport().name());
        });


        // 방 참여 이벤트 (기존 방에서 나가고 새로운 방에 참가)
        // 프론트에서
        server.addEventListener("join-room", String.class, (client, roomId, ackRequest) -> {

            //  기존 방에서 나가기 (저장된 roomId 사용)
            String currentRoom = client.get("roomId");
            if (currentRoom != null) {
                client.leaveRoom(currentRoom);
                System.out.println(" Client " + client.getSessionId() + " left room: " + currentRoom);
            }

            // 새로운 방에 참가
            client.joinRoom(roomId);
            client.set("roomId", roomId); //  새로운 roomId 저장
            System.out.println("Client " + client.getSessionId() + " joined room: " + roomId);

            // 클라이언트에 접속 정보 보내기
            if (ackRequest.isAckRequested()) {
                ackRequest.sendAckData("joined: " + roomId);
            }
        });

        //방 나가기
        server.addEventListener("leave-room", String.class, (client, roomId, ackRequest) -> {
            String currentRoom = client.get("roomId");

            // 현재 사용자가 속한 방이 맞는지 확인 후 나가기
            if (currentRoom != null && currentRoom.equals(roomId)) {
                client.leaveRoom(roomId);
                client.set("roomId", null);  // 상태 초기화
                System.out.println(" Client " + client.getSessionId() + " left room: " + roomId);

                // 클라이언트에게 응답 보내기
                if (ackRequest.isAckRequested()) {
                    ackRequest.sendAckData("left: " + roomId);
                }
            }
        });



        // 그림 데이터 전송 (같은 방의 사용자끼리)
        server.addEventListener("message", DrawingDto.class, (client, data, ackRequest) -> {
            System.out.println(" Drawing data received from: " + client.getSessionId());

            String roomId = client.get("roomId");
            if (roomId != null) {
                server.getRoomOperations(roomId).sendEvent("message", data);
            }
        });

        //  클라이언트 연결 해제 시 자동 퇴장
        server.addDisconnectListener(client -> {
            String roomId = client.get("roomId");
            if (roomId != null) {
                client.leaveRoom(roomId);
                System.out.println("Client " + client.getSessionId() + " disconnected and left room: " + roomId);
            }
        });

        return server;
    }
}