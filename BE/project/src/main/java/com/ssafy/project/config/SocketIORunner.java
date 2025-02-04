package com.ssafy.project.config;

import com.corundumstudio.socketio.SocketIOServer;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SocketIORunner implements CommandLineRunner, DisposableBean {
    private final SocketIOServer server;

    @Override
    public void run(String... args) {
        server.start();
        System.out.println("SocketIO server started on port: " + server.getConfiguration().getPort());
    }

    @Override
    public void destroy() {
        if (server != null) {
            server.stop();
            System.out.println("SocketIO server stopped");
        }
    }
}
