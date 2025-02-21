package com.ssafy.project.dto.report;

public interface ActivityHistoryDto {
    // 활동 내역 (많이 읽은 책 3개 & 읽은 횟수)
    String getBookTitle(); // 많이 읽은 책 제목
    String getBookPath(); // 많이 읽은 책 URL
    int getReadCount(); // 읽은 횟수
}
