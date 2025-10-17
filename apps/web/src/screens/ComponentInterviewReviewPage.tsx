import { Button } from '@fehub/ui'

export const ComponentInterviewReviewPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-[#f5f3ff] dark:bg-background">
      <div className="text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <svg className="h-10 w-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground">
            Component Interview Review
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-muted-foreground">
            Đánh giá và cải thiện kỹ năng phỏng vấn
          </p>
        </div>
        
        <div className="mx-auto max-w-md space-y-4">
          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            Tính năng Component Interview Review đang được phát triển. Bạn sẽ có thể:
          </p>
          <ul className="text-left text-sm text-slate-600 dark:text-muted-foreground">
            <li>• Xem lại các buổi phỏng vấn đã thực hiện</li>
            <li>• Phân tích điểm mạnh và điểm cần cải thiện</li>
            <li>• Nhận gợi ý cải thiện từ AI</li>
            <li>• Theo dõi tiến độ học tập</li>
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
