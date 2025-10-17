import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface RouteConfig {
  title: string
  favicon: string
}

const routeConfigs: Record<string, RouteConfig> = {
  '/admin/login': {
    title: 'Đăng nhập Admin - FE Interview Hub',
    favicon: '/favicon-admin.svg'
  },
  '/admin/dashboard': {
    title: 'Dashboard Admin - FE Interview Hub',
    favicon: '/favicon-admin.svg'
  },
  '/admin/lessons': {
    title: 'Quản lý Bài học - FE Interview Hub',
    favicon: '/favicon-admin.svg'
  },
  '/admin/users': {
    title: 'Quản lý Người dùng - FE Interview Hub',
    favicon: '/favicon-admin.svg'
  },
  '/admin/progress': {
    title: 'Quản lý Tiến độ - FE Interview Hub',
    favicon: '/favicon-admin.svg'
  },
  '/admin/settings': {
    title: 'Cài đặt Admin - FE Interview Hub',
    favicon: '/favicon-admin.svg'
  }
}

const getRouteConfig = (pathname: string): RouteConfig => {
  // Kiểm tra các route chính xác
  if (routeConfigs[pathname]) {
    return routeConfigs[pathname]
  }
  
  // Kiểm tra các route động
  if (pathname.startsWith('/admin/lessons/')) {
    return {
      title: 'Chỉnh sửa Bài học - FE Interview Hub',
      favicon: '/favicon-admin.svg'
    }
  }
  
  // Mặc định
  return {
    title: 'Admin Panel - FE Interview Hub',
    favicon: '/favicon-admin.svg'
  }
}

export const useDynamicTitle = () => {
  const location = useLocation()

  useEffect(() => {
    const config = getRouteConfig(location.pathname)
    
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
  }, [location.pathname])
}
