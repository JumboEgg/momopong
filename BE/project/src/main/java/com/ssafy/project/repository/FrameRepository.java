package com.ssafy.project.repository;

import com.ssafy.project.domain.Frame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FrameRepository extends JpaRepository<Frame, Long> {

    @Query("SELECT f FROM Frame f WHERE f.child.id = :childId ORDER BY f.createdAt DESC")
    List<Frame> findAllByChildId(@Param("childId") Long childId);
}
