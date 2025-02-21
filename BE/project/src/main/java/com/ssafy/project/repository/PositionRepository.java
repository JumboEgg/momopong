package com.ssafy.project.repository;

import com.ssafy.project.domain.book.Page;
import com.ssafy.project.domain.book.Position;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PositionRepository extends JpaRepository<Position, Long> {
     Optional<Position> findByPage(Page page);
}
