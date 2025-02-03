package com.ssafy.project.repository;

import com.ssafy.project.domain.book.Page;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PageRepository extends JpaRepository<Page, Long> {

}
