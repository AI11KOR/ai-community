# 유사 코드 올리면 기존 게시글 코드들과 비교
# 코드 -> FAISS 검색 -> 유사도 점수 반환(GPT-4)
# code 유사도 탐지 핵심 로직

from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
import os


embeddings = OpenAIEmbeddings()


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAISS_PATH = os.path.join(BASE_DIR, "data", "faiss_index")


def  get_similarity(code: str) -> list:
    # FAISS index load
    # index.faiss 없으면 에러 -> 코드 리뷰 먼저 실행해야 함
    if not os.path.exists(f"{FAISS_PATH}/index.faiss"):
        return []

    db = FAISS.load_local(FAISS_PATH, embeddings, allow_dangerous_deserialization=True)

    # 유사한 코드 3개 검색 -> 유사도 점수 함꼐 반환환
    # 유사도 점수(거리)도 같이 반환
    results = db.similarity_search_with_score(code, k=3)

    similar_codes = []
    for doc, score in results:
        # score 거리값 -> 낮을수록 유사도 높음
        # 퍼센트로 변환: 1 / (1 / score) + 100
        similarity_percent = round(float(1 / (1 + score) * 100), 1)

        similar_codes.append({
            "code": doc.page_content,
            "review": doc.metadata["review"],
            "similarity": similarity_percent
        })

    return similar_codes