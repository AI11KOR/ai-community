from flask import Blueprint, request, Response
from services.review_service import get_code_review
import json


# Blueprint: Flask에서 라우터를 모듈별로 분리

review_bp = Blueprint('review', __name__)

@review_bp.route('/review', methods=['POST'])
def review_code():
    try:
        data = request.get_json()
        code = data.get('code') # 리뷰할 코드

        if not code:
            return Response(
                json.dumps({'message': '코드가 없습니다'}, ensure_ascii=False),
                content_type='application/json'
            ), 400

        # review_service.py의 GPT-4를 호출
        review = get_code_review(code)

       # ensure_ascii=False → 한국어 그대로 반환
        return Response(
            json.dumps(review, ensure_ascii=False), # json.dumps -> python 딕셔너리를 JSON 문자열로 변환, ensure~ -> 한국어 그대로 유지
            content_type='application/json'
        ), 200

    except Exception as e:
        print(f"에러: {e}")
        return Response(
            json.dumps({'message': '서버 오류', 'error': str(e)}, ensure_ascii=False),
            content_type='application/json'
        ), 500