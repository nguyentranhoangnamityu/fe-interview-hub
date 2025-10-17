# Admin Panel - FE Interview Hub

## Tổng quan
Admin Panel là ứng dụng quản trị cho FE Interview Hub, cho phép quản lý bài học, người dùng, tiến độ học tập và các cài đặt hệ thống.

## Tính năng chính

### 🔐 Xác thực Admin
- Đăng nhập với username: `namnth`
- Mật khẩu: `Hoangnam01@`
- Session được lưu trong sessionStorage
- Tự động redirect nếu chưa đăng nhập

### 📊 Dashboard
- Thống kê tổng quan hệ thống
- Số liệu về bài học, người dùng, tiến độ
- Biểu đồ hoạt động (placeholder)
- Danh sách hoạt động gần đây

### 📚 Quản lý Bài học
- Xem danh sách tất cả bài học
- Thông tin chi tiết: tên, tech stack, độ khó, thời gian
- Số lượng học viên đang học
- Trạng thái bài học (Hoạt động/Nháp)
- Các hành động: Xem, Chỉnh sửa, Xóa

### 👥 Quản lý Người dùng
- Danh sách người dùng với thông tin chi tiết
- Email, ngày tham gia
- Tiến độ học tập (thanh tiến độ)
- Trạng thái tài khoản (Hoạt động/Tạm khóa)
- Khả năng khóa/mở khóa tài khoản

### 📈 Quản lý Tiến độ
- Thống kê tổng quan về tiến độ học tập
- Tiến độ chi tiết theo từng bài học
- Số lượng học viên: Hoàn thành, Đang học, Chưa bắt đầu
- Tỷ lệ hoàn thành trung bình

### ⚙️ Cài đặt
- Bảo mật: Thay đổi mật khẩu, 2FA
- Hệ thống: Email, sao lưu dữ liệu
- Database: Tối ưu, dọn dẹp
- Thông báo: Email, in-app
- Thông tin hệ thống

## Cấu trúc dự án

```
apps/admin/
├── public/
│   └── favicon-admin.svg
├── src/
│   ├── components/
│   │   └── AdminLayout.tsx
│   ├── hooks/
│   │   └── useDynamicTitle.ts
│   ├── providers/
│   │   └── AdminAuthProvider.tsx
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   ├── screens/
│   │   ├── DashboardPage.tsx
│   │   ├── LessonsPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProgressPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── UsersPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Cài đặt và chạy

```bash
# Cài đặt dependencies
pnpm install

# Chạy development server
pnpm dev

# Build cho production
pnpm build
```

## Truy cập Admin Panel

1. Truy cập: `http://localhost:3001`
2. Đăng nhập với:
   - Username: `namnth`
   - Password: `Hoangnam01@`

## Tính năng đặc biệt

### 🎨 Favicon và Title động
- Favicon đỏ đặc trưng cho admin
- Title thay đổi theo từng trang
- Tự động cập nhật khi điều hướng

### 📱 Responsive Design
- Giao diện responsive cho mobile và desktop
- Sidebar có thể thu gọn trên mobile
- Layout tối ưu cho các kích thước màn hình

### 🔒 Bảo mật
- Chỉ admin được phép truy cập
- Session management
- Protected routes
- Logout tự động khi session hết hạn

## Mở rộng trong tương lai

- [ ] Tích hợp API thực tế
- [ ] Thêm biểu đồ thống kê chi tiết
- [ ] Export dữ liệu (Excel, PDF)
- [ ] Thông báo real-time
- [ ] Audit logs
- [ ] Backup tự động
- [ ] Multi-admin support
