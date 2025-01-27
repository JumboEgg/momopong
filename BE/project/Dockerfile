# 1. Java 17 런타임 이미지를 기반으로 사용
FROM openjdk:17-jdk-slim

# 2. 컨테이너 내부의 작업 디렉토리 설정
WORKDIR /app

# 3. JAR 파일 복사 (실행 가능한 JAR 파일)
COPY build/libs/project-0.0.1-SNAPSHOT.jar app.jar

# 4. 애플리케이션 실행 명령어
CMD ["java", "-jar", "app.jar"]