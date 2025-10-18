import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@fehub/ui'
import { cn } from '@fehub/ui'
import { useAuth } from '../providers/AuthProvider'
import { useState, useEffect, type ReactNode } from 'react'

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

type MenuItem = {
  title: string
  href: string
  icon: ReactNode
  isActive?: (pathname: string) => boolean
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
      </svg>
    ),
  },
  {
    title: 'Knowledge Base',
    href: '/knowledge-base',
    isActive: (pathname: string) =>
      pathname === '/knowledge-base' || /^\/knowledge-base\/(?!explorer).+/.test(pathname),
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Knowledge Explorer',
    href: '/knowledge-base/explorer',
    isActive: (pathname: string) => pathname.startsWith('/knowledge-base/explorer'),
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h4v4H4V6zm6 0h4v4h-4V6zm6 0h4v4h-4V6zM4 12h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 18h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
      </svg>
    ),
  },
  {
    title: 'AI Interview',
    href: '/ai-interview',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Component Interview Review',
    href: '/component-interview-review',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

export const Sidebar = ({ className, isOpen = true, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1200) // Increased breakpoint to avoid layout issues
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile/Tablet Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed xl:relative z-50 h-full bg-white/90 backdrop-blur-xl border-r border-indigo-200/60 dark:bg-card/80 dark:border-slate-800',
        isCollapsed ? 'w-16' : 'w-72 sm:w-80 md:w-80 lg:w-72 xl:w-80 2xl:w-88',
        'transform transition-all duration-300 ease-in-out',
        isMobile 
          ? (isOpen ? 'translate-x-0' : '-translate-x-full')
          : 'translate-x-0',
        className
      )}>
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center justify-between border-b border-indigo-200/60 px-4 sm:px-5 md:px-6 lg:px-4 xl:px-6 dark:border-slate-800">
            {!isCollapsed && (
              <h1 className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl font-bold text-indigo-700 dark:text-indigo-400 truncate">
                FE Interview Hub
              </h1>
            )}
            {isCollapsed && (
              <div className="flex items-center justify-center w-full">
                <span className="text-lg font-bold text-indigo-700 dark:text-indigo-400">FE</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {/* Collapse button for desktop */}
              {!isMobile && onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
                  title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isCollapsed ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    )}
                  </svg>
                </button>
              )}
              
              {/* Close button for mobile/tablet */}
              {isMobile && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 xl:hidden flex-shrink-0"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className={cn(
              "border-b border-indigo-200/60 py-4 dark:border-slate-800",
              isCollapsed ? "px-2" : "px-4 sm:px-5 md:px-6 lg:px-4 xl:px-6"
            )}>
              {!isCollapsed ? (
                <div className="flex items-center gap-3">
                  {user.picture && (
                    <img
                      alt={user.name}
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border object-cover flex-shrink-0"
                      src={user.picture}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-foreground truncate">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-muted-foreground truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {user.picture && (
                    <img
                      alt={user.name}
                      className="h-8 w-8 rounded-full border object-cover"
                      src={user.picture}
                    />
                  )}
                </div>
              )}
              
              {!isCollapsed && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="mt-3 w-full text-xs sm:text-sm"
                >
                  Đăng xuất
                </Button>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 md:px-4 lg:px-3 xl:px-4 py-4 sm:py-5 md:py-6 lg:py-4 xl:py-6">
            <ul className="space-y-1 sm:space-y-1.5 md:space-y-2">
              {menuItems.map((item) => {
                const isActive = item.isActive
                  ? item.isActive(location.pathname)
                  : location.pathname === item.href ||
                    (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
                
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        'flex items-center rounded-lg transition-colors',
                        isCollapsed 
                          ? 'justify-center px-2 py-2' 
                          : 'gap-2 sm:gap-2.5 md:gap-3 lg:gap-2 xl:gap-3 px-2 sm:px-2.5 md:px-3 lg:px-2 xl:px-3 py-2 sm:py-2.5 md:py-2.5 lg:py-2 xl:py-2.5',
                        'text-sm sm:text-sm md:text-sm lg:text-sm xl:text-sm font-medium',
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <span className="flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5">{item.icon}</span>
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-indigo-200/60 p-3 sm:p-3.5 md:p-4 lg:p-3 xl:p-4 dark:border-slate-800">
            {!isCollapsed && (
              <div className="text-xs sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">
                <p>© 2024 FE Interview Hub</p>
                <p className="mt-1">Học tập hiệu quả</p>
              </div>
            )}
            {isCollapsed && (
              <div className="flex items-center justify-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">FE</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
