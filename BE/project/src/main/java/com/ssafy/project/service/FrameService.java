package com.ssafy.project.service;

import com.ssafy.project.dto.FrameDto;

import java.util.List;
import java.util.Map;

public interface FrameService {


    void saveFrame(Long childId, String frameTitle, String frameURL);

    List<FrameDto> getFramesByChildId(Long childId);
}
