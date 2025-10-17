import { Button } from '@fehub/ui'
import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center text-foreground">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">404 - Không tìm thấy trang</h1>
        <p className="text-sm text-muted-foreground">
          Xin lỗi, trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">Quay lại Dashboard</Link>
      </Button>
    </div>
  )
}
