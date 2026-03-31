import { Request, Response } from 'express'
import axios from 'axios'
import FormData from 'form-data'

// AI 서버 주소
const AI_SERVER = process.env.AI_SERVER_URL || 'http://localhost:5005'

// code review
export const reviewCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.body

        if (!code) {
            return res.status(400).json({ message: '코드가 없습니다' })
        }

        // Python ai 서버로 요청 전달
        const response = await axios.post(`${AI_SERVER}/ai/review`, { code })

        res.status(200).json(response.data)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 코드 리뷰 에러:', error })
    }
}

// code similarity
export const checkSimilarity = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        if(!code) {
            return res.status(400).json({ message: '코드가 없습니다.' })
        }

        const response = await axios.post(`${AI_SERVER}/ai/similarity`, { code })

        res.status(200).json(response.data)
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 유사도 처리 에러:', error })
    }
}

// 회의록 생성
export const transcribeAudio = async (req: Request, res: Response) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: '음성 파일이 없습니다.' })
        }

        // multer가 메모리에 올린 파일을 FormData로 변환
        // Python AI 서버로 파일 전달
        const formData = new FormData()
        formData.append('audio', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        })

        const response = await axios.post(`${AI_SERVER}/ai/transcribe`, formData, {
            headers: formData.getHeaders()
        })

        res.status(200).json(response.data)

    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 회의록 생성 에러:', error })
    }
}