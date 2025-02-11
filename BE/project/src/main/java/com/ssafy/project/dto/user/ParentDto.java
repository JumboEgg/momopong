package com.ssafy.project.dto.user;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ParentDto {

    private Long parentId;
    private String email;
    private String name;
    private String phone;
}
