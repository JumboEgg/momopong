package com.ssafy.project.dto.book;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookListDto {
    private Long bookId;
    private String bookTitle;
    private Integer totalPage;
    private String role1;
    private String role2;
    private List<PageDto> pages = new ArrayList<>();
}
