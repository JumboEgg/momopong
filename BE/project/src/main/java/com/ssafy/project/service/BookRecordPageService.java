package com.ssafy.project.service;


import com.ssafy.project.dto.record.BookRecordPageDto;
import com.ssafy.project.dto.record.BookRecordPageIdDto;

public interface BookRecordPageService {
    BookRecordPageIdDto saveRecordPage(BookRecordPageDto bookRecordPageDto);
}
