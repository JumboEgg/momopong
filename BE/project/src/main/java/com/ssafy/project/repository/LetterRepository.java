package com.ssafy.project.repository;

import com.ssafy.project.domain.Letter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LetterRepository extends JpaRepository<Letter, Long> {
    Letter findByChildIdAndLetterId(Long childId, Long letterId);

    @Query("SELECT l FROM Letter l WHERE l.child.id = :childId ORDER BY l.createdAt DESC")
    List<Letter> findAllByChildId(@Param("childId") Long childId);

    @Query("SELECT l FROM Letter l WHERE l.child.id = :childId AND DATE(l.createdAt) = CURRENT_DATE ORDER BY l.createdAt DESC")
    List<Letter> findTodayLettersByChildId(@Param("childId") Long childId);

}
