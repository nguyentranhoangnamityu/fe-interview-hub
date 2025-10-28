import { Upload, Image as ImageIcon } from 'lucide-react'
import { useState, useRef, useEffect, type ChangeEvent } from 'react'

type EditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Parse markdown để tìm images
const parseImages = (content: string): Array<{ alt: string; url: string }> => {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  const images: Array<{ alt: string; url: string }> = []
  let match
  
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      alt: match[1] || '',
      url: match[2] || ''
    })
  }
  
  return images
}

// Format value để hiển thị trong textarea - ẩn base64 dài
const formatDisplayValue = (content: string): string => {
  // Replace base64 images with shorter placeholder
  return content.replace(/!\[([^\]]*)\]\(data:image\/[^;]+;base64,[^)]+\)/g, '![$1](base64)')
}

export const LessonContentEditor = ({ value, onChange, placeholder }: EditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [localValue, setLocalValue] = useState(formatDisplayValue(value))
  const [lastValue, setLastValue] = useState(value)

  // Sync localValue khi value prop thay đổi
  useEffect(() => {
    if (value !== lastValue) {
      setLocalValue(formatDisplayValue(value))
      setLastValue(value)
    }
  }, [value, lastValue])

  // Restore base64 từ value gốc
  const restoreBase64 = (displayValue: string): string => {
    // Find placeholders with base64 in display
    const placeholderRegex = /!\[([^\]]*)\]\(base64\)/g
    let result = displayValue
    let match

    const placeholders: Array<{ alt: string }> = []
    while ((match = placeholderRegex.exec(displayValue)) !== null) {
      placeholders.push({ alt: match[1] || '' })
    }

    // Find corresponding base64 images in original value
    const base64Regex = /!\[([^\]]*)\]\(data:image\/[^;]+;base64,[^)]+\)/g
    let base64Match
    let base64Index = 0

    while ((base64Match = base64Regex.exec(value)) !== null && base64Index < placeholders.length) {
      result = result.replace(
        `![${placeholders[base64Index].alt}](base64)`,
        base64Match[0]
      )
      base64Index++
    }

    return result
  }

  const handleTextChange = (newDisplayValue: string) => {
    setLocalValue(newDisplayValue)
    const restoredValue = restoreBase64(newDisplayValue)
    onChange(restoredValue)
  }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        // Create base64 data URL
        const markdownImage = `![Hình ảnh](${result})`
        const cursorPosition = value.length
        const newValue = value.slice(0, cursorPosition) + '\n\n' + markdownImage + '\n\n' + value.slice(cursorPosition)
        onChange(newValue)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await handleFileSelect(file)
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (items) {
      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'))
      if (imageItem) {
        e.preventDefault()
        const file = imageItem.getAsFile()
        if (file) {
          await handleFileSelect(file)
        }
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      await handleFileSelect(files[0])
    }
  }

  const handleImageUrlInput = () => {
    const url = prompt('Nhập URL hình ảnh:')
    if (url) {
      const alt = prompt('Nhập mô tả hình ảnh (tùy chọn):') || 'Hình ảnh'
      const markdownImage = `![${alt}](${url})`
      const cursorPosition = value.length
      const newValue = value.slice(0, cursorPosition) + '\n\n' + markdownImage + '\n\n' + value.slice(cursorPosition)
      onChange(newValue)
    }
  }

  const images = parseImages(value)

  return (
    <div>
      <textarea
        value={localValue}
        onChange={(e) => handleTextChange(e.target.value)}
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`h-48 w-full rounded-lg border px-3 py-2 text-xs focus:border-transparent focus:ring-2 focus:ring-red-500 ${
          isDragging ? 'border-red-400 bg-red-50' : 'border-slate-200'
        }`}
        placeholder={placeholder || 'Viết nội dung... (Có thể dán hình ảnh trực tiếp)'}
      />
      
      {/* Preview hình ảnh */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-lg border border-slate-200">
              <img
                src={img.url}
                alt={img.alt}
                className="h-24 w-full object-contain p-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IbnhoIHRvbmcgdGkmaSBoadKwam5nPC90ZXh0Pjwvc3ZnPg=='
                  target.classList.add('opacity-50')
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload file
        </button>
        <button
          type="button"
          onClick={handleImageUrlInput}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Thêm URL
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
      
      <p className="mt-1 text-xs text-slate-400">
        💡 Tip: Có thể dán hình ảnh trực tiếp (Ctrl+V) hoặc kéo thả vào ô trên
      </p>
    </div>
  )
}

