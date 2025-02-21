package com.ssafy.project.config;

import com.corundumstudio.socketio.SocketIOServer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class SocketIORunner implements CommandLineRunner, DisposableBean {
    private final SocketIOServer server;

    @Override
    public void run(String... args) {
        // 서버 시작 전 포트 점유 여부 확인
        if (isPortInUse(3869)) {
            log.info("Port 3869 is already in use. Stopping existing process...");
            killProcessOnPort(3869);
        }

        server.start();
        log.info("SocketIO server started on port={}", server.getConfiguration().getPort());
    }

    @Override
    public void destroy() {
        if (server != null) {
            server.stop();
            log.info("SocketIO server stopped");
        }
    }

    // 포트 사용 여부 확인
    private boolean isPortInUse(int port) {
        try {
            Process process = Runtime.getRuntime().exec("lsof -i :" + port);
            return process.getInputStream().read() != -1;
        } catch (IOException e) {
            return false;
        }
    }

    // 포트를 점유한 프로세스를 종료
    private void killProcessOnPort(int port) {
        try {
            Process process = Runtime.getRuntime().exec("fuser -k " + port + "/tcp");
            process.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
