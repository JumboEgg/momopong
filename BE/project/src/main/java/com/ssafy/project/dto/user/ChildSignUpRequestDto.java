package com.ssafy.project.dto.user;

import com.ssafy.project.domain.type.GenderType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChildSignUpRequestDto {

    @NotNull
    private Long parentId;

    @NotNull
    @Size(min = 1, max = 50)
    private String name; // 이름

    private String profile; // 프로필 사진 url

    @NotNull
    private LocalDate birth; // 생년월일

    private GenderType gender; // 성별
}
