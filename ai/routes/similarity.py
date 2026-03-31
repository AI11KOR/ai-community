# 코드 유사도 탐지 API 엔드포인트
# 요청을 받으면 simlarity_service 호출 -> 결과 반환

from flask import Blueprint, request, Response
from services.similarity_service import get_similarity
import json

similarity_bp = Blueprint('similarity', __name__)

@similarity_bp.route('/similarity', methods=['POST'])
def check_similarity():
    try:
        data = request.get_json()
        code = data.get('code')

        if not code:
            return Response(
                json.dumps({'message': '코드가 없습니다.'}, ensure_ascii=False),
                content_type='application/json'
            ), 400

        # similarity_service.py 호출
        results = get_similarity(code)

        return Response(
            json.dumps({'results': results}, ensure_ascii=False),
            content_type='application/json'
        ), 200

    except Exception as e:
        print(f"에러: {e}")
        return Response(
            json.dumps({'message': '서버 오류', 'error': str(e)}, ensure_ascii=False),
            content_type='application/json'
        ), 500
