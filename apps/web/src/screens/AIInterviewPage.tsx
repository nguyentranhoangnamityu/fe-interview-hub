import { Button } from '@fehub/ui'

export const AIInterviewPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-[#f5f3ff] dark:bg-background">
      <div className="text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
            <svg className="h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground">
            AI Interview
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-muted-foreground">
            Thực hành phỏng vấn với AI thông minh
          </p>
        </div>
        
        <div className="mx-auto max-w-md space-y-4">
          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            Tính năng AI Interview đang được phát triển. Bạn sẽ có thể:
          </p>
          <ul className="text-left text-sm text-slate-600 dark:text-muted-foreground">
            <li>• Thực hành phỏng vấn với AI</li>
            <li>• Nhận feedback tự động</li>
            <li>• Theo dõi tiến độ cải thiện</li>
            <li>• Luyện tập các câu hỏi phổ biến</li>
          </ul>
          
          <div className="pt-4">
            <Button variant="outline" disabled>
              Sắp ra mắt
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
