# Mock Interview AI Setup

## 🆓 Cấu hình API AI Miễn phí

Hệ thống hỗ trợ nhiều API AI miễn phí với fallback system:

### 1. Groq API (Khuyến nghị - Nhanh nhất)
1. Truy cập [Groq Console](https://console.groq.com/)
2. Đăng ký tài khoản miễn phí
3. Tạo API key mới
4. Thêm vào file `.env.local`:

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

**Ưu điểm:**
- ✅ Hoàn toàn miễn phí
- ✅ Tốc độ cực nhanh (LLaMA 3)
- ✅ Không giới hạn nghiêm ngặt

### 2. Hugging Face API (Backup)
1. Truy cập [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Tạo Access Token mới
3. Thêm vào file `.env.local`:

```
VITE_HUGGINGFACE_API_KEY=your_hf_token_here
```

**Ưu điểm:**
- ✅ Miễn phí với giới hạn hợp lý
- ✅ Nhiều model khác nhau
- ✅ Stable và reliable

### 3. Fallback System
Nếu không có API key nào, hệ thống sẽ sử dụng câu trả lời mẫu để đảm bảo tính năng vẫn hoạt động.

**Lưu ý về bảo mật:**
- API key sẽ được gửi từ trình duyệt
- Chỉ sử dụng trong môi trường development/testing
- Trong production, nên sử dụng backend proxy

## Cách sử dụng

1. Vào Knowledge Base và chọn bài học
2. Click vào "Mock Interview" 
3. Chọn cấp độ phù hợp (Junior, Middle, Senior)
4. Bắt đầu phỏng vấn với AI

## Tính năng

- **Junior Level**: 5-7 câu hỏi, tập trung vào kiến thức cơ bản
- **Middle Level**: 7-10 câu hỏi, tập trung vào giải quyết vấn đề
- **Senior Level**: 10-15 câu hỏi, tập trung vào kiến trúc và leadership

AI sẽ tương tác tự nhiên như một interviewer thực tế và đưa ra phản hồi phù hợp với từng cấp độ.

## 📊 So sánh các API

| API | Chi phí | Tốc độ | Chất lượng | Giới hạn |
|-----|---------|--------|------------|----------|
| **Groq** | 🆓 Miễn phí | ⚡ Rất nhanh | ⭐⭐⭐⭐ | 30 req/min |
| **Hugging Face** | 🆓 Miễn phí | 🐌 Chậm hơn | ⭐⭐⭐ | 1000 req/tháng |
| **Fallback** | 🆓 Miễn phí | ⚡ Tức thì | ⭐⭐ | Không giới hạn |

## 🔧 Troubleshooting

### Lỗi "API key not found":
1. Kiểm tra file `.env.local` có tồn tại không
2. Kiểm tra tên biến có đúng không:
   - `VITE_GROQ_API_KEY` cho Groq
   - `VITE_HUGGINGFACE_API_KEY` cho Hugging Face
3. Restart dev server sau khi thêm environment variables

### Lỗi "API error":
1. Kiểm tra API key có hợp lệ không
2. Kiểm tra kết nối internet
3. Hệ thống sẽ tự động fallback sang API khác

### Performance chậm:
1. Groq API thường nhanh nhất
2. Hugging Face có thể chậm do model lớn
3. Fallback system luôn nhanh nhất
