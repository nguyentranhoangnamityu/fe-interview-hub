# Test API Keys

Để test các API key, tạo file `.env.local` trong thư mục `apps/web/` với nội dung:

```bash
# Groq API (Khuyến nghị)
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here

# Hugging Face API (Backup)  
VITE_HUGGINGFACE_API_KEY=hf_your_huggingface_token_here
```

## Cách lấy API Keys:

### Groq API:
1. Vào https://console.groq.com/
2. Đăng ký/đăng nhập
3. Vào API Keys section
4. Tạo key mới
5. Copy key (bắt đầu với `gsk_`)

### Hugging Face API:
1. Vào https://huggingface.co/settings/tokens
2. Đăng ký/đăng nhập
3. Tạo token mới với quyền "Read"
4. Copy token (bắt đầu với `hf_`)

## Test ngay:

Sau khi cấu hình, vào Mock Interview và test:
- Nếu có Groq key: Sẽ sử dụng Groq (nhanh nhất)
- Nếu chỉ có HF key: Sẽ sử dụng Hugging Face
- Nếu không có key nào: Sẽ dùng fallback responses

Hệ thống sẽ tự động chọn API tốt nhất có sẵn!
