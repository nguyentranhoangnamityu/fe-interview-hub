# Hướng dẫn Setup Admin Panel

## 🚀 Chạy Admin Panel

### 1. Cài đặt dependencies
```bash
# Từ thư mục gốc của project
pnpm install
```

### 2. Chạy Admin Panel
```bash
# Chạy chỉ admin panel
pnpm dev:admin

# Hoặc chạy tất cả apps
pnpm dev
```

### 3. Truy cập Admin Panel
- URL: `http://localhost:3001`
- Username: `namnth`
- Password: `Hoangnam01@`

## 🔧 Cấu hình

### Port
Admin panel chạy trên port `3001` để tránh xung đột với web app (port 3000).

### Authentication
- Chỉ có 1 admin account được hardcode
- Session được lưu trong sessionStorage
- Tự động logout khi đóng browser

### Favicon
- Favicon đỏ đặc trưng cho admin
- Tự động cập nhật theo từng trang

## 📁 Cấu trúc Admin Panel

```
/admin/login          - Trang đăng nhập
/admin/dashboard      - Dashboard tổng quan
/admin/lessons        - Quản lý bài học
/admin/users          - Quản lý người dùng
/admin/progress       - Quản lý tiến độ
/admin/settings       - Cài đặt hệ thống
```

## 🎨 Tính năng UI/UX

### Responsive Design
- Mobile-first approach
- Sidebar có thể thu gọn
- Layout tối ưu cho mọi kích thước màn hình

### Color Scheme
- Primary: Red (#DC2626)
- Background: Gray tones
- Cards: White với shadow
- Status colors: Green (active), Yellow (warning), Red (danger)

### Icons
- Sử dụng Lucide React icons
- Consistent iconography
- Meaningful visual cues

## 🔒 Bảo mật

### Authentication
- Hardcoded credentials (có thể mở rộng sau)
- Session-based authentication
- Protected routes
- Auto-redirect khi chưa login

### Data Protection
- Không lưu sensitive data trong localStorage
- SessionStorage cho temporary data
- Secure logout

## 🚀 Deployment

### Build
```bash
pnpm build
```

### Production
- Build files sẽ được tạo trong `dist/`
- Có thể deploy lên bất kỳ static hosting nào
- Cần cấu hình routing cho SPA

## 🔄 Tích hợp với Web App

### Shared Components
- Sử dụng `@fehub/ui` package
- Shared types từ `@fehub/types`
- Consistent styling với Tailwind

### API Integration
- Có thể tích hợp với API từ `apps/api`
- Sử dụng cùng `apiClient` pattern
- Shared authentication nếu cần

## 📊 Monitoring & Analytics

### Dashboard Metrics
- Tổng số bài học
- Số lượng người dùng
- Tỷ lệ hoàn thành
- Thời gian học trung bình

### User Management
- Xem danh sách users
- Quản lý trạng thái tài khoản
- Theo dõi tiến độ cá nhân

## 🛠️ Development

### Hot Reload
- Vite dev server với HMR
- Fast refresh cho React components
- CSS hot reload

### TypeScript
- Full TypeScript support
- Type safety cho tất cả components
- IntelliSense và autocomplete

### Linting
- ESLint configuration
- Prettier formatting
- Consistent code style
