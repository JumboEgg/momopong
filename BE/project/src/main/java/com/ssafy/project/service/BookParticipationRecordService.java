package com.ssafy.project.service;

import com.ssafy.project.dto.record.BookParticipationRecordDto;

public interface BookParticipationRecordService {

    BookParticipationRecordDto save(BookParticipationRecordDto bookParticipationRecordDto);

    BookParticipationRecordDto updateExitStatus(Long recordId);
}
