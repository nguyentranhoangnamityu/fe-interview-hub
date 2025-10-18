import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  ClipboardList,
  Settings, 
  LogOut, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Bài học',
    href: '/admin/lessons',
    icon: BookOpen,
  },
  {
    title: 'Người dùng',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Tiến độ',
    href: '/admin/progress',
    icon: BarChart3,
  },
  {
    title: 'Interview Prep',
    href: '/admin/interview-preps',
    icon: ClipboardList,
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings,
  },
]

export const Sidebar = ({ 
  className, 
  isOpen = true, 
  onClose, 
  isCollapsed = false, 
  onToggleCollapse 
}: SidebarProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1200)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSignOut = () => {
    // Implement logout logic here
    navigate('/admin/login', { replace: true })
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
      <aside className={`
        fixed xl:relative z-50 h-full bg-white/90 backdrop-blur-xl border-r border-red-200/60 dark:bg-card/80 dark:border-slate-800
        ${isCollapsed ? 'w-16' : 'w-72 sm:w-80 md:w-80 lg:w-72 xl:w-80 2xl:w-88'}
        transform transition-all duration-300 ease-in-out
        ${isMobile 
          ? (isOpen ? 'translate-x-0' : '-translate-x-full')
          : 'translate-x-0'
        }
        ${className || ''}
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-red-200/60 dark:border-slate-700">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-2"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="text-lg font-semibold text-red-700 dark:text-red-400">
                    Admin Panel
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Collapse Toggle */}
            {!isMobile && onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-slate-700 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </button>
            )}
            
            {/* Mobile Close Button */}
            {isMobile && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    to={item.href}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                      ${isActive 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' 
                        : 'text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-red-600 dark:text-red-400' : 'text-slate-500 group-hover:text-red-500 dark:text-slate-400'}`} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-red-200/60 dark:border-slate-700">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-red-50/50 dark:bg-slate-800/50">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        Admin User
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        admin@example.com
                      </p>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400 rounded-lg transition-all duration-200 group"
                  >
                    <LogOut className="h-5 w-5 text-slate-500 group-hover:text-red-500 dark:text-slate-400" />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Collapsed User Icon */}
            {isCollapsed && (
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400 rounded-lg transition-all duration-200"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
