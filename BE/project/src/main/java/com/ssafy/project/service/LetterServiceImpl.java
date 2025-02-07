package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Letter;
import com.ssafy.project.dto.LetterDto;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.LetterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class LetterServiceImpl implements LetterService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final LetterRepository letterRepository;
    private final ChildRepository childRepository;

    //
    @Override
    public String getGPTResponse(String fairyTale, String role, String childName, String content) {
        // GPT 프롬프트 생성
        String prompt = String.format(
                "너는 동화 속 주인공이야. 아래의 지시를 따라서 8세 아이가 주인공에게 쓴 편지에 답장을 해줘. " +
                        "###지시사항### " +
                        "1. 아이의 편지와 맥락이 맞는 답장을 작성해줘 " +
                        "2. 8세 아이가 받을 거니까 말투를 상냥하고 이야기를 잘 풀어서 이야기 해줘 " +
                        "3. 4줄로 적어줘 " +
                        "4. 끝인사를 넣어줘 " +
                        "5. 보낸사람의 이름도 답장에 넣어줘 " +
                        "###정보### " +
                        "동화: \"%s\" " +
                        "역할: \"%s\" " +
                        "아이 이름: \"%s\" " +
                        "편지 내용: \"%s\"",
                fairyTale, role, childName, content
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("messages", Arrays.asList(
                Map.of("role", "user", "content", prompt)
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        var response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions",
                entity,
                Map.class
        );

        Map body = response.getBody();
        List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    @Override
    public List<LetterDto> getLettersByChildId(Long childId) {
        List<Letter> letters = letterRepository.findAllByChildId(childId);
        return letters.stream()
                .map(Letter::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public LetterDto getLetter(Long childId, Long letterId) {
        Letter letter = letterRepository.findByChildIdAndLetterId(childId, letterId);
        if (letter == null) {
            throw new RuntimeException("편지를 찾을 수 없습니다.");
        }

        return Letter.entityToDto(letter);
    }

    @Override
    @Transactional
    public Letter saveLetter(Long childId, String content,  String reply, String bookTitle,String role, String letterRecord) {
    Child child = childRepository.findById(childId)
            .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        Letter letter = Letter.builder()
                .child(child)
                .letter(content)
                .reply(reply)
                .bookTitle(bookTitle)
                .role(role)
                .letterRecord(letterRecord)
                .createdAt(LocalDateTime.now())
                .build();

        return letterRepository.save(letter);
    }
}