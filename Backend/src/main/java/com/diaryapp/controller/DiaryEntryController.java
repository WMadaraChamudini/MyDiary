package com.diaryapp.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.diaryapp.entity.DiaryEntry;
import com.diaryapp.repository.DiaryEntryRepository;

@RestController
@RequestMapping("/api/diary")
@CrossOrigin(origins = "*")
public class DiaryEntryController {
    private final DiaryEntryRepository diaryEntryRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public DiaryEntryController(DiaryEntryRepository diaryEntryRepository) {
        this.diaryEntryRepository = diaryEntryRepository;
    }

    @PostMapping
    public ResponseEntity<DiaryEntry> createEntry(
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "audio", required = false) MultipartFile audio) throws IOException {
        DiaryEntry entry = new DiaryEntry();
        entry.setContent(content);

        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Handle file uploads
        if (image != null && !image.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.write(filePath, image.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.WRITE);
            entry.setImagePath(fileName);
        }
        if (video != null && !video.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + video.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.write(filePath, video.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.WRITE);
            entry.setVideoPath(fileName);
        }
        if (audio != null && !audio.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + audio.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.write(filePath, audio.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.WRITE);
            entry.setAudioPath(fileName);
        }

        DiaryEntry savedEntry = diaryEntryRepository.save(entry);
        return ResponseEntity.ok(savedEntry);
    }

    @GetMapping
    public ResponseEntity<List<DiaryEntry>> getAllEntries() {
        List<DiaryEntry> entries = diaryEntryRepository.findAll();
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiaryEntry> getEntryById(@PathVariable Long id) {
        return diaryEntryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/media/{filename}")
    public ResponseEntity<Resource> serveMedia(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(uploadDir, filename);
        Resource resource = new FileSystemResource(filePath.toFile());
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        String contentType = Files.probeContentType(filePath);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                .body(resource);
    }
}
