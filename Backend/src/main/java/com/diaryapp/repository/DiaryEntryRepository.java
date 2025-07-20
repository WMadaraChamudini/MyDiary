package com.diaryapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diaryapp.entity.DiaryEntry;

public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {
}