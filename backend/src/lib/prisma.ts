// Prisma 클라이언트를 한 곳에서 만들어 재사용 하는 파일
// DB연결을 매번 새로 만들면 연결이 쌓여 문제가 생기는데, 한번만 만들어 놓고 여러 파일에서 가져다 쓰는 것 react로 치면 컴포넌트 역할

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default prisma