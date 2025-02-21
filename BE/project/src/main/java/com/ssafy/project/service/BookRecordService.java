package com.ssafy.project.service;

import com.ssafy.project.dto.record.BookParticipationRecordDto;

public interface BookRecordService {

    BookParticipationRecordDto save(BookParticipationRecordDto bookParticipationRecordDto);

    BookParticipationRecordDto completeParticipation(Long recordId);
}
