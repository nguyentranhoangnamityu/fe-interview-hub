import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Button } from '@fehub/ui'

interface AppLayoutProps {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1200 // Increased breakpoint to avoid layout issues
      setIsMobile(mobile)
      // Auto-close sidebar on mobile/tablet when resizing to desktop
      if (!mobile) {
        setSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="flex h-screen bg-[#f5f3ff] dark:bg-background overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile/Tablet header with menu button */}
        {isMobile && (
          <header className="flex items-center justify-between p-3 sm:p-4 bg-white/90 backdrop-blur-xl border-b border-indigo-200/60 dark:bg-card/80 dark:border-slate-800 xl:hidden flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="p-2 flex-shrink-0"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <h1 className="text-base sm:text-lg font-bold text-indigo-700 dark:text-indigo-400 truncate">
              FE Interview Hub
            </h1>
            <div className="w-9 flex-shrink-0" /> {/* Spacer for centering */}
          </header>
        )}
        
        <main className="flex-1 overflow-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}
