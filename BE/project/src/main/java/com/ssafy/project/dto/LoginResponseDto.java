package com.ssafy.project.dto;

import com.ssafy.project.security.JwtToken;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {

    private ParentDto parentDto;
    private JwtToken jwtToken;
}
