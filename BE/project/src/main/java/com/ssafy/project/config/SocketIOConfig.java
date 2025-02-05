package com.ssafy.project.config;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.Transport;
import com.ssafy.project.dto.DrawingDto;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class SocketIOConfig {
    @Bean
    public SocketIOServer socketIOServer() {
        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(3869);  // 포트번호 확인
        config.setOrigin("*");  // 모든 출처 허용
        config.setAllowCustomRequests(true);
        // 또는 특정 출처만 허용
        // config.setOrigin("http://localhost:5173"); // Vite 기본 포트

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

        // 방 참여 이벤트
        server.addEventListener("join-room", String.class, (client, roomId, ackRequest) -> {
            client.joinRoom(roomId);
            System.out.println("Client " + client.getSessionId() + " joined room: " + roomId);
        });


        // 드로잉 이벤트 리스너 추가
        server.addEventListener("message", DrawingDto.class, (client, data, ackRequest) -> {
            System.out.println("Drawing data received");
            // 보낸 사람을 제외한 모든 클라이언트에게 전송
            server.getBroadcastOperations().sendEvent("message", data);

//            System.out.println("Drawing data received: " + client.getAllRooms());  // 로그 추가
//            // 같은 방에 있는 다른 클라이언트들에게만 전송
//            for (String room : client.getAllRooms()) {
//                server.getRoomOperations(room).sendEvent("message", data);
//            }
        });



        return server;
    }
}