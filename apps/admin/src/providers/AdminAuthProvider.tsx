import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AdminUser {
  id: string
  username: string
  name: string
}

interface AdminAuthContextValue {
  user: AdminUser | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

// Thông tin admin cứng
const ADMIN_CREDENTIALS = {
  username: 'namnth',
  password: 'Hoangnam01@',
  user: {
    id: 'admin-1',
    username: 'namnth',
    name: 'Admin Nam'
  }
}

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra session storage khi load app
    const savedUser = sessionStorage.getItem('admin-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        sessionStorage.removeItem('admin-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setUser(ADMIN_CREDENTIALS.user)
      sessionStorage.setItem('admin-user', JSON.stringify(ADMIN_CREDENTIALS.user))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('admin-user')
  }

  const value: AdminAuthContextValue = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
