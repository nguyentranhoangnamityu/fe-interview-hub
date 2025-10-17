export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; language: string; snippet: string }

export type LessonQuizOption = {
  id: string
  text: string
}

export type LessonQuiz = {
  id: string
  prompt: string
  options: LessonQuizOption[]
  correctOptionId: string
  explanation: string
  points: number
}

export type LessonMockPrompt = {
  id: string
  role: 'junior' | 'middle' | 'senior'
  question: string
  evaluationKeywords: string[]
  guidance: string
}

export type LessonCover = {
  url: string
  alt: string
}

export type LessonSection = {
  id: string
  title: string
  body: ContentBlock[]
}

export type LessonResource = {
  title: string
  url: string
}

export type TechStack = {
  id: string
  name: string
  description: string
  logo: string
  color: string
  lessons: string[]
}

export type Lesson = {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedTime: number
  techStack: string
  tags: string[]
  sections: LessonSection[]
  resources?: LessonResource[]
  coverImage?: LessonCover
  quizzes?: LessonQuiz[]
  mockPrompts?: LessonMockPrompt[]
  origin?: 'seed' | 'custom'
}

export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed'

export type LessonProgress = {
  status: LessonProgressStatus
  completedSectionIds: string[]
  updatedAt: string
}

export type LessonProgressStore = Record<string, Record<string, LessonProgress>>

export type LessonQuizResult = {
  answers: Record<string, string>
  score: number
  totalPoints: number
  completedAt: string | null
}

export type LessonQuizStore = Record<string, Record<string, LessonQuizResult>>

export type CreateLessonPayload = Omit<Lesson, 'id' | 'origin'> & { id?: string }

export type UpdateLessonPayload = Partial<Omit<Lesson, 'id' | 'origin'>>
