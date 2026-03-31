# 음성 파일 받아서 transcribe_service 호출 → 회의록 반환
# 음성파일 업로드 → Whisper STT → GPT-4 요약 → 결과 반환

from flask import Blueprint, request, jsonify
from services.transcribe_service import transcribe_audio
import json
from flask import Response

transcribe_bp = Blueprint('transcribe', __name__)

@transcribe_bp.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        # 코드 리뷰와 다르게 JSON이 아니라 파일을 받음
        # request.files: 업로드된 파일을 꺼내는 Flask 방식
        if 'audio' not in request.files:
            return Response(
                json.dumps({'message': '음성 파일이 없습니다.'}, ensure_ascii=False),
                content_type='application/json'
            ), 400

        audio_file = request.files['audio'] # 업로드된 음성 파일

        # transcribe_service.py 호출
        result = transcribe_audio(audio_file)

        return Response(
            json.dumps(result, ensure_ascii=False),
            content_type='application/json'
        ), 200


    except Exception as e:
        print(f"에러: {e}")
        return Response(
            json.dumps({'message': '서버 오류', 'error': str(e)}, ensure_ascii=False)
        ), 500 


