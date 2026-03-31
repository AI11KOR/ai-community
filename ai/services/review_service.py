# GPT-4 호출해서 코드 리뷰 결과 만들어주는 핵심 로직
# review.py -> review_service.py 호출 -> 결과를 반환
# code 입력 -> FAISS 에서 유사 사례 검색 -> gpt-4 호출 -> 리뷰 반환

from openai import OpenAI
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
import json
import os

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# FAISS_PATH = os.path.join(BASE_DIR, "data", "faiss_index") # 해당 경로로 설정
# SAMPLE_PATH = os.path.join(BASE_DIR, "data", "sample_reviews.json")


# openai 클라이언트 초기화
client = OpenAI()

# embedding model 초기화
# 텍스트를 백터(숫자 배열) 로 변환해주는 AI모델
embeddings = OpenAIEmbeddings()

# FAISS 인덱스 저장 경로
# FAISS_PATH = "data/faiss_index"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAISS_PATH = os.path.join(BASE_DIR, "data", "faiss_index")
SAMPLE_PATH = os.path.join(BASE_DIR, "data", "sample_reviews.json")


def load_faiss():
    """FAISS 인덱스 로드 또는 최초 생성""" # 최초 실행시 sample_reviews.json 읽어서 해당 내용을 임베딩으로 벡터 변환

    # 이미 저장된 인덱스가 있으면 불러옴
    if os.path.exists(f"{FAISS_PATH}/index.faiss"):
        return FAISS.load_local(FAISS_PATH, embeddings, allow_dangerous_deserialization=True)

    # 없으면 샘플 데이터로 최초 생성
    with open(SAMPLE_PATH, "r", encoding="utf-8") as f:
        samples = json.load(f)

    # 샘플 데이터를 Document 형태로 변환
    # page_content: 검색에 사용할 텍스트 (코드)
    # metadata: 검색 결과와 함께 반환할 부가 정보 (리뷰)
    docs = [
        Document(
            page_content=s["code"], # 검색 대상 (벡터로 변환됨)
            metadata={"review": s["review"]} # 검색 결과와 함께 딸려오는 데이터
        )
        for s in samples
    ]

    # vetor DB 생성 후 저장
    db = FAISS.from_documents(docs, embeddings) # FAISS 벡터DB 생성
    db.save_local(FAISS_PATH) # index.faiss(벡터 데이터), index.pkl(메타데이터 - 리뷰 텍스트) 파일로 저장, 해당 FAISS_PATH로 설정한 경로로 저장하는 것
    return db


def get_code_review(code: str) -> str:
    # FAISS에서 유사한 코드 사례 2개 검색
    db = load_faiss()
    similar_docs = db.similarity_search(code, k=2)

    # 검색된 유사 사례를 문자열로 정리
    context = ""
    for i, doc in enumerate(similar_docs):
        context += f"[유사 사례 {i+1}]\n"
        context += f"코드: {doc.page_content}\n"
        context += f"리뷰: {doc.metadata['review']}\n\n"


    # GPT-4 보낼 프롬프트, 유사 사례 + 리뷰할 코드 함께 전달
    response = client.chat.completions.create(
        model='gpt-4o-mini', # gpt-4 대비 저렴
        messages=[
            {
                "role": "system",
                "content": 
                    """당신은 10년 경력의 시니어 개발자입니다.
                    코드를 분석해서 반드시 아래 JSON 형식으로만 답변하세요.
                    language 필드는 실체 코드 언어를 정확히 감지하세요
            {
            "language": (Python, JavaScript, TypeScript, Java, C++, HTML, CSS, SQL 등),
            "severity": "warning",
            "severityReason": "심각도 판단 이유",
            "review": "전체 리뷰 내용",
            "improvements": [
                {
                "point": "개선 포인트 제목",
                "description": "설명",
                "hasCode": true,
                "improvedCode": "개선된 코드 (없으면 null)"
                }
            ],
            "isGoodCode": false,
            "praise": "코드가 좋을 경우 칭찬 메시지 (나쁠 경우 null)"
            }
            severity 값: "danger"(보안취약점/심각버그) / "warning"(개선필요) / "good"(양호)
            isGoodCode: 전반적으로 잘 작성된 코드면 true"""
            },
            {
                "role": "user",
                "content": f"[참고 사례]\n{context}\n[리뷰할 코드]\n```\n{code}\n```"
            }
        ]
    )

    result_text = response.choices[0].message.content
    result_text = result_text.replace("```json", "").replace("```", "").strip()
    result = json.loads(result_text)

    # GPT 응답해서 텍스트만 추출
    # return response.choices[0].message.content
    return result