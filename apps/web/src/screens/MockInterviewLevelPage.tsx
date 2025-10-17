import { Button } from '@fehub/ui'
import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useKnowledgeBase } from '../providers/KnowledgeBaseProvider'

const levelConfig = {
  junior: {
    title: 'Junior Developer',
    description: 'Phù hợp cho các bạn mới bắt đầu, tập trung vào kiến thức cơ bản',
    icon: '🌱',
    color: 'bg-green-500',
    questions: '5-7 câu hỏi',
    duration: '15-20 phút',
    difficulty: 'Cơ bản'
  },
  middle: {
    title: 'Middle Developer', 
    description: 'Dành cho developer có kinh nghiệm, tập trung vào giải quyết vấn đề',
    icon: '🚀',
    color: 'bg-blue-500',
    questions: '7-10 câu hỏi',
    duration: '25-35 phút',
    difficulty: 'Trung bình'
  },
  senior: {
    title: 'Senior Developer',
    description: 'Thử thách cao nhất, tập trung vào kiến trúc và leadership',
    icon: '👑',
    color: 'bg-purple-500',
    questions: '10-15 câu hỏi',
    duration: '40-60 phút',
    difficulty: 'Nâng cao'
  }
}

export const MockInterviewLevelPage = () => {
  const { lessonId = '' } = useParams<{ lessonId: string }>()
  const { getLesson } = useKnowledgeBase()

  const lesson = useMemo(() => (lessonId ? getLesson(lessonId) : undefined), [getLesson, lessonId])

  if (!lesson) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#eef2ff] text-slate-900 dark:bg-background dark:text-foreground">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-[-12rem] h-[26rem] w-[26rem] rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />
          <div className="absolute -right-24 bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-sky-200/45 blur-3xl dark:bg-sky-500/25" />
        </div>
        <div className="relative flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Không tìm thấy bài học</h1>
            <Button asChild className="mt-4">
              <Link to="/knowledge-base">Quay lại Knowledge Base</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef2ff] text-slate-900 dark:bg-background dark:text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-12rem] h-[26rem] w-[26rem] rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute -right-24 bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-sky-200/45 blur-3xl dark:bg-sky-500/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),_transparent_58%)] dark:bg-none" />
      </div>
      
      <div className="relative">
        <div className="px-6 py-10 sm:px-10 xl:px-16 lg:py-14">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Button asChild variant="outline" size="sm">
                <Link to={`/knowledge-base/${lessonId}`}>← Quay lại bài học</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
            
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-500 mb-4">
              Mock Interview
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              {lesson.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Chọn cấp độ phỏng vấn phù hợp với trình độ của bạn. AI sẽ tương tác với bạn như một interviewer thực tế.
            </p>
          </div>

          {/* Level Selection Cards */}
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              {Object.entries(levelConfig).map(([level, config]) => (
                <div
                  key={level}
                  className="group relative rounded-3xl border border-indigo-200/70 bg-white/90 p-8 shadow-xl shadow-indigo-200/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-300/40 hover:-translate-y-2 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  {/* Level Icon */}
                  <div className="mb-6 flex items-center justify-center">
                    <div className={`${config.color} rounded-full p-4 text-3xl shadow-lg`}>
                      {config.icon}
                    </div>
                  </div>

                  {/* Level Info */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {config.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  {/* Level Details */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Số câu hỏi:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{config.questions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Thời gian:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{config.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Độ khó:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{config.difficulty}</span>
                    </div>
                  </div>

                  {/* Start Button */}
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg"
                  >
                    <Link to={`/knowledge-base/${lessonId}/mock-interview/${level}`}>
                      Bắt đầu phỏng vấn
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="rounded-3xl border border-indigo-200/70 bg-white/85 p-8 shadow-xl shadow-indigo-200/30 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  💡 Cách thức hoạt động
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  AI sẽ đóng vai trò interviewer và tương tác với bạn như một cuộc phỏng vấn thực tế
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AI Interviewer</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    AI sẽ đặt câu hỏi và phản hồi dựa trên câu trả lời của bạn
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl">💬</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Tương tác tự nhiên</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Cuộc trò chuyện sẽ diễn ra tự nhiên như phỏng vấn thực tế
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Đánh giá kết quả</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Nhận phản hồi và gợi ý cải thiện sau khi hoàn thành
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
