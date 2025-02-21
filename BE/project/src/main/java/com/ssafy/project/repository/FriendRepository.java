package com.ssafy.project.repository;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    Optional<Friend> findByFromAndTo(Child from, Child to);

    @Query(value = "SELECT f FROM Friend f WHERE f.from = :from AND f.status = true")
    List<Friend> findAllByFrom(@Param("from") Child from);

    List<Friend> findAllByToAndStatusIs(Child to, boolean status);
}
