import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useKnowledgeBase } from '../providers/KnowledgeBaseProvider'

interface RouteConfig {
  title: string
  favicon: string
}

const routeConfigs: Record<string, RouteConfig> = {
  '/login': {
    title: 'Đăng nhập - FE Interview Hub',
    favicon: '/favicon-login.svg'
  },
  '/dashboard': {
    title: 'Dashboard - FE Interview Hub',
    favicon: '/favicon-dashboard.svg'
  },
  '/knowledge-base': {
    title: 'Cơ sở kiến thức - FE Interview Hub',
    favicon: '/favicon-knowledge.svg'
  },
  '/ai-interview': {
    title: 'Phỏng vấn AI - FE Interview Hub',
    favicon: '/favicon-ai.svg'
  },
  '/component-interview-review': {
    title: 'Đánh giá phỏng vấn - FE Interview Hub',
    favicon: '/favicon-interview.svg'
  }
}

const getRouteConfig = (pathname: string, getLesson?: (lessonId: string) => any): RouteConfig => {
  // Kiểm tra các route cụ thể trước
  if (pathname.startsWith('/knowledge-base/') && pathname.includes('/quiz')) {
    const lessonId = pathname.split('/')[2]
    const lesson = getLesson?.(lessonId)
    const lessonName = lesson?.title || 'Bài học'
    return {
      title: `Quiz: ${lessonName} - FE Interview Hub`,
      favicon: '/favicon-quiz.svg'
    }
  }
  
  if (pathname.startsWith('/knowledge-base/') && pathname.includes('/mock-interview')) {
    const lessonId = pathname.split('/')[2]
    const lesson = getLesson?.(lessonId)
    const lessonName = lesson?.title || 'Bài học'
    return {
      title: `Mock Interview: ${lessonName} - FE Interview Hub`,
      favicon: '/favicon-interview.svg'
    }
  }
  
  if (pathname.startsWith('/knowledge-base/')) {
    const lessonId = pathname.split('/')[2]
    const lesson = getLesson?.(lessonId)
    const lessonName = lesson?.title || 'Bài học'
    return {
      title: `${lessonName} - FE Interview Hub`,
      favicon: '/favicon-knowledge.svg'
    }
  }
  
  // Kiểm tra các route chính xác
  if (routeConfigs[pathname]) {
    return routeConfigs[pathname]
  }
  
  // Mặc định
  return {
    title: 'FE Interview Hub',
    favicon: '/favicon-default.svg'
  }
}

export const useDynamicTitle = () => {
  const location = useLocation()
  const { getLesson } = useKnowledgeBase()

  useEffect(() => {
    const config = getRouteConfig(location.pathname, getLesson)
    
    // Cập nhật title
    document.title = config.title
    
    // Cập nhật favicon
    const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement
    if (faviconLink) {
      faviconLink.href = config.favicon
    } else {
      // Tạo favicon link nếu chưa có
      const link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/svg+xml'
      link.href = config.favicon
      document.head.appendChild(link)
    }
  }, [location.pathname, getLesson])
}
