from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)


# CORS 설정
# 프론트(3003), 백엔드(8008)에서 오는 요청만 허용
CORS(app, origins=[
    "http://localhost:3003",
    "http://localhost:8008",
    "https://baepo.shop",
    "http://43.201.249.175",
    "null" # 로컬 파일에서 테스트할 때 필요
])

# JSON 응답에서 한국어 깨짐 방지
app.config['JSON_AS_ASCII'] = False


# 라우터 등록 (나중에 기능 만들면서 주석 해제)
from routes.review import review_bp
from routes.similarity import similarity_bp
from routes.transcribe import transcribe_bp
app.register_blueprint(review_bp, url_prefix='/ai')
app.register_blueprint(similarity_bp, url_prefix='/ai')
app.register_blueprint(transcribe_bp, url_prefix='/ai')



@app.route('/health')
def health():
    return jsonify({ 'status': 'ok', 'message': 'AI server 정상 동작 중' })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)