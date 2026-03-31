# whisper로 음성-> 텍스트 변환 후 GPT-4로 요약
# 음성파일 -> whisper SIT -> GPT-4 요약 - 반환

from openai import OpenAI
import json

client = OpenAI()


def transcribe_audio(audio_file) -> dict:
    # Flask filestorage -> bytes로 변환
    # openai 는 파일명과 bytes 튜플 형식으로 받게 처리
    audio_bytes = audio_file.read()
    file_tuple = (audio_file.filename, audio_bytes, audio_file.content_type)


    # whisper로 음성을 텍스트로 변환
    # audio_file: 프론트에서 받은 음성 파일
    transcrit = client.audio.transcriptions.create(
        model = 'whisper-1', # openai whisper 모델
        # file = audio_file,
        file = file_tuple, # 튜플 형식으로 전달
        language='ko'
    )

    full_text = transcrit.text # 변환된 텍스트
    print(f"whisper 변환 완료!: {full_text}") # 에러 확인 및 성공 확인

    # GPT-4로 요약 
    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {
                "role": "system",
                "content": f"""당신은 회의록 분석 전문가입니다.
            회의 내용을 분석해서 반드시 아래 JSON 형식으로만 답변하세요.
            다른 텍스트는 절대 포함하지 마세요:
            {{
            "summary": "회의 내용 3-5줄 요약",
            "actionItems": ["담당자: 할일1", "담당자: 할일2"],
            "sentiment": {{
                "positive": 70,
                "negative": 30,
                "description": "전반적으로 긍정적인 분위기의 회의였습니다"
            }},
            "efficiency": {{
                "score": 85,
                "reason": "명확한 액션아이템이 도출되었고 회의 목표가 달성되었습니다"
            }},
            "speakers": {{
                {{"name": "김우현", "ratio": 70}},  # 전체 대화의 70%
                {{"name": "홍길동", "ratio": 30}}   # 전체 대화의 30%
            }},
            "keywords": [
                {{"word": "API", "count": 3}},
                {{"word": "배포", "count": 2}}
            ]
            }}"""
            },
            {
                "role": "user",
                "content": f"다음 회의 내용을 분석해주세요:\n\n{full_text}"  
            }
        ]
    )

    # gpt 응답 파싱
    result_text = response.choices[0].message.content

    # GPT가 json으로 감싸는 것 제거
    result_text = result_text.replace("```json", "").replace("```", "").strip()
    result = json.loads(result_text)

    return {
        "fullText": full_text,
        "summary": result["summary"],
        "actionItems": result["actionItems"],
        "sentiment": result["sentiment"],      # 분위기 분석
        "efficiency": result["efficiency"],    # 효율성 점수
        "speakers": result["speakers"],
        "keywords": result["keywords"]         # 키워드 추출
    }