# Hệ thống Favicon và Title động

## Tổng quan
Hệ thống này tự động cập nhật favicon và title của trang web dựa trên route hiện tại, giúp người dùng dễ dàng nhận biết trang nào đang được truy cập.

## Cấu trúc Favicon

### Các favicon được tạo:
- `favicon-default.svg` - Favicon mặc định cho các route không xác định
- `favicon-login.svg` - Favicon cho trang đăng nhập (màu tím)
- `favicon-dashboard.svg` - Favicon cho dashboard (màu xanh dương)
- `favicon-knowledge.svg` - Favicon cho cơ sở kiến thức (màu xanh lá)
- `favicon-quiz.svg` - Favicon cho quiz (màu cam)
- `favicon-interview.svg` - Favicon cho mock interview (màu tím)
- `favicon-ai.svg` - Favicon cho AI interview (màu đỏ)

## Cấu hình Route

### Các route được hỗ trợ:
- `/login` → "Đăng nhập - FE Interview Hub"
- `/dashboard` → "Dashboard - FE Interview Hub"
- `/knowledge-base` → "Cơ sở kiến thức - FE Interview Hub"
- `/knowledge-base/:lessonId` → "[Tên bài học] - FE Interview Hub"
- `/knowledge-base/:lessonId/quiz` → "Quiz: [Tên bài học] - FE Interview Hub"
- `/knowledge-base/:lessonId/mock-interview` → "Mock Interview: [Tên bài học] - FE Interview Hub"
- `/ai-interview` → "Phỏng vấn AI - FE Interview Hub"
- `/component-interview-review` → "Đánh giá phỏng vấn - FE Interview Hub"

**Lưu ý:** Tên bài học được lấy động từ KnowledgeBaseProvider thông qua `getLesson(lessonId)`.

## Cách hoạt động

1. Hook `useDynamicTitle` được gọi trong `App.tsx`
2. Hook theo dõi thay đổi route bằng `useLocation()` và sử dụng `useKnowledgeBase()` để lấy thông tin bài học
3. Khi route thay đổi, hook sẽ:
   - Xác định config phù hợp dựa trên pathname
   - Lấy tên bài học từ KnowledgeBaseProvider nếu là route bài học
   - Cập nhật `document.title` với tên bài học cụ thể
   - Cập nhật favicon trong `<head>`

## Thêm route mới

Để thêm route mới, cập nhật `routeConfigs` trong `useDynamicTitle.ts`:

```typescript
const routeConfigs: Record<string, RouteConfig> = {
  // ... existing routes
  '/new-route': {
    title: 'Tên trang mới - FE Interview Hub',
    favicon: '/favicon-new.svg'
  }
}
```

## Tùy chỉnh Favicon

1. Tạo file SVG mới trong thư mục `public/`
2. Đặt tên theo format `favicon-[tên].svg`
3. Cập nhật config trong `routeConfigs`
4. Favicon sẽ tự động được áp dụng khi route thay đổi
