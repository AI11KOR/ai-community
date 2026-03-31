export interface User {
    id: number
    email: string
    name: string
    avatar?: string
    provider: string
    createdAt: string
  }
  
  export interface LoginRequest {
    email: string
    password: string
  }
  
  export interface RegisterRequest {
    email: string
    password: string
    name: string
  }
  
  export interface LoginResponse {
    message: string
    accessToken: string
    refreshToken: string
    user: User
  }
  
  export interface Post {
    id: number
    title: string
    content: string
    code?: string
    language?: string
    // aiReview?: any
    authorId: number
    author: {
      id: number
      name: string
      avatar?: string
    }
    _count?: { comments: number }
    comments?: Comment[]
    createdAt: string
    updatedAt: string
  }
  
  export interface Comment {
    id: number
    content: string
    authorId: number
    author: {
      id: number
      name: string
      avatar?: string
    }
    postId: number
    createdAt: string
  }

  export interface CreatePostRequest {
    title: string
    content: string
    code?: string
    language?: string
  }


  export interface MyPageResponse {
    id: number
    email: string
    name: string
    avatar?: string
    provider: string
    createdAt: string
  }


  export interface MeetingResult {
    fullText: string
    summary: string
    actionItems: string[]
    sentiment: {
        positive: number
        negative: number
        description: string
    }
    efficiency: {
        score: number
        reason: string
    }
    speakers: {
        name: string
        ratio: number
    }[]
    keywords: {
        word: string
        count: number
    }[]
}