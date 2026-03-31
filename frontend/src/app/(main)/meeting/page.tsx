// 회의록 생성 페이지
// 음성 녹음 파일 -> 백엔드 -> ai 서버 -> 회의록 결과 표시

'use client'

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';
import { MeetingResult } from '@/types/auth';
import toast from 'react-hot-toast';
// pdf 파일 다운로드
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function MeetingPage() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MeetingResult | null>(null)
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null)

    const resultRef = useRef<HTMLDivElement>(null)


    const handleSubmit = async () => {
        if(!file) {
            toast.error('음성 파일을 선택해 주세요');
            return;
        }

        setLoading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('audio', file)

            const { data } = await api.post('/api/ai/transcribe', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            setResult(data)

        } catch (error: any) {
            setError(error.response?.data?.message || '회의록 생성 실패')
        } finally {
            setLoading(false)
        }
    }


    const handleDownLoadPDF = async () => {
        if(!resultRef.current) return;

        try {
            toast.loading('PDF 생성 중...')
            const canvas = await html2canvas(resultRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`회의록_${new Date().toLocaleDateString('ko-KR')}.pdf`)
            toast.dismiss()
            toast.success('PDF 다운로드 완료')
        } catch (error:any) {
            toast.dismiss()
            toast.error('PDF 생성 실패')
        }
    }

    return (
        <div className='max-w-3xl mx-auto px-4 py-8'>
            <h1 className="text-xl font-bold mb-2">회의록 생성</h1>
            <p className="text-sm text-gray-500 mb-6">음성 파일을 업로드하면 AI가 자동으로 회의록을 생성합니다</p>

            {/* 파일 업로드 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition"
                >
                    <p className="text-3xl mb-2">🎙️</p>
                    <p className="text-sm text-gray-500">
                        {file ? file.name : '음성 파일을 클릭하여 선택하세요'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">mp3, mp4, wav, m4a 지원</p>
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    accept="audio/*,video/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? '🤖 AI 분석 중...' : '회의록 생성'}
                </button>
            </div>

            {/* 결과 */}
            {result && (
                <div ref={resultRef} className="space-y-4">

                    {/* 다운로드 버튼 */}
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={handleDownLoadPDF}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                        >
                            PDF 다운로드
                        </button>
                    </div>



                    {/* 요약 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-sm font-bold mb-2">📝 회의 요약</h2>
                        <p className="text-sm text-gray-700">{result.summary}</p>
                    </div>

                    {/* 액션아이템 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-sm font-bold mb-2">✅ 액션아이템</h2>
                        <ul className="space-y-1">
                            {result.actionItems.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 분위기 + 효율성 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <h2 className="text-sm font-bold mb-3">😊 회의 분위기</h2>
                            <div className="flex gap-2 mb-2">
                                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-green-400 h-full rounded-full"
                                        style={{ width: `${result.sentiment.positive}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>긍정 {result.sentiment.positive}%</span>
                                <span>부정 {result.sentiment.negative}%</span>
                            </div>
                            <p className="text-xs text-gray-600">{result.sentiment.description}</p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <h2 className="text-sm font-bold mb-3">⚡ 효율성 점수</h2>
                            <div className="text-3xl font-bold text-blue-500 mb-1">
                                {result.efficiency.score}
                                <span className="text-sm text-gray-400 font-normal">/100</span>
                            </div>
                            <p className="text-xs text-gray-600">{result.efficiency.reason}</p>
                        </div>
                    </div>

                    {/* 화자 분석 */}
                    {result.speakers && result.speakers.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <h2 className="text-sm font-bold mb-3">👥 화자 분석</h2>
                            <div className="space-y-2">
                                {result.speakers.map((speaker, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-700 w-20">{speaker.name}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-blue-400 h-full rounded-full"
                                                style={{ width: `${speaker.ratio}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{speaker.ratio}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 키워드 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-sm font-bold mb-3">🏷️ 주요 키워드</h2>
                        <div className="flex flex-wrap gap-2">
                            {result.keywords.map((kw, idx) => (
                                <span
                                    key={idx}
                                    className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full"
                                >
                                    {kw.word} ({kw.count})
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 전체 텍스트 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h2 className="text-sm font-bold mb-2">📄 전체 내용</h2>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{result.fullText}</p>
                    </div>

                </div>
            )}
        </div>
    )
}