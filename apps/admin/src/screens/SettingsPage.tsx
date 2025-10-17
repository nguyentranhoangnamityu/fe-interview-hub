import { Settings, Shield, Database, Bell, Key, Save, RefreshCw, Download, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const settingsSections = [
  {
    title: 'Bảo mật',
    description: 'Quản lý mật khẩu và xác thực',
    icon: Shield,
    color: 'red',
    items: [
      { name: 'Thay đổi mật khẩu admin', description: 'Cập nhật mật khẩu đăng nhập', action: 'changePassword' },
      { name: 'Cài đặt xác thực 2FA', description: 'Bảo mật tài khoản với 2FA', action: 'setup2FA' },
    ]
  },
  {
    title: 'Hệ thống',
    description: 'Cài đặt chung của hệ thống',
    icon: Settings,
    color: 'blue',
    items: [
      { name: 'Cấu hình email', description: 'Thiết lập gửi email thông báo', action: 'emailConfig' },
      { name: 'Sao lưu dữ liệu', description: 'Tạo và quản lý bản sao lưu', action: 'backup' },
    ]
  },
  {
    title: 'Cơ sở dữ liệu',
    description: 'Quản lý và bảo trì database',
    icon: Database,
    color: 'green',
    items: [
      { name: 'Tối ưu database', description: 'Chạy các tác vụ tối ưu hóa', action: 'optimizeDB' },
      { name: 'Xóa dữ liệu cũ', description: 'Dọn dẹp dữ liệu không cần thiết', action: 'cleanup' },
    ]
  },
  {
    title: 'Thông báo',
    description: 'Cài đặt thông báo hệ thống',
    icon: Bell,
    color: 'purple',
    items: [
      { name: 'Email thông báo', description: 'Cấu hình gửi email tự động', action: 'emailNotifications' },
      { name: 'Thông báo trong app', description: 'Thiết lập thông báo nội bộ', action: 'appNotifications' },
    ]
  },
]

export const SettingsPage = () => {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: string) => {
    setIsLoading(true)
    setActiveAction(action)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setActiveAction(null)
    alert(`Đã thực hiện: ${action}`)
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'border-red-200/70 bg-gradient-to-br from-red-500/10 via-red-400/10 to-pink-400/10 shadow-red-200/20'
      case 'blue':
        return 'border-blue-200/70 bg-gradient-to-br from-blue-500/10 via-blue-400/10 to-indigo-400/10 shadow-blue-200/20'
      case 'green':
        return 'border-green-200/70 bg-gradient-to-br from-green-500/10 via-green-400/10 to-emerald-400/10 shadow-green-200/20'
      case 'purple':
        return 'border-purple-200/70 bg-gradient-to-br from-purple-500/10 via-purple-400/10 to-pink-400/10 shadow-purple-200/20'
      default:
        return 'border-slate-200/70 bg-gradient-to-br from-slate-500/10 via-slate-400/10 to-gray-400/10 shadow-slate-200/20'
    }
  }

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-600 dark:text-red-400'
      case 'blue':
        return 'text-blue-600 dark:text-blue-400'
      case 'green':
        return 'text-green-600 dark:text-green-400'
      case 'purple':
        return 'text-purple-600 dark:text-purple-400'
      default:
        return 'text-slate-600 dark:text-slate-400'
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-foreground">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-8rem] h-[20rem] w-[20rem] rounded-full bg-gradient-to-r from-red-400/30 to-pink-400/30 blur-3xl animate-pulse" />
        <div className="absolute -right-24 bottom-[-10rem] h-[22rem] w-[22rem] rounded-full bg-gradient-to-r from-orange-400/30 to-red-400/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[30rem] rounded-full bg-gradient-to-r from-red-400/20 to-pink-400/20 blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_60%)] dark:bg-none" />
      </div>
      
      <div className="relative flex min-h-screen flex-col">
        <main className="flex w-full flex-1 flex-col gap-4 sm:gap-6 px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="rounded-2xl sm:rounded-3xl border border-red-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-red-200/20 dark:border-slate-800 dark:bg-card/90"
          >
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-red-700 dark:text-red-400">Cài đặt</h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Quản lý cài đặt hệ thống và bảo mật
            </p>
          </motion.div>

          {/* Settings Sections */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {settingsSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                className={`rounded-2xl sm:rounded-3xl border ${getColorClasses(section.color)} bg-white/90 backdrop-blur-sm shadow-xl dark:border-slate-800 dark:bg-card/90 overflow-hidden hover:shadow-lg transition-all duration-300`}
              >
                <div className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <section.icon className={`h-6 w-6 ${getIconColor(section.color)}`} />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                        {section.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 + itemIndex * 0.05, duration: 0.3 }}
                        className="flex items-center justify-between p-3 border border-slate-200/60 rounded-lg hover:bg-slate-50/50 dark:border-slate-700 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAction(item.action)}
                          disabled={isLoading}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                            isLoading && activeAction === item.action
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : `${getIconColor(section.color)} hover:bg-slate-100 dark:hover:bg-slate-800`
                          }`}
                        >
                          {isLoading && activeAction === item.action ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            'Cấu hình'
                          )}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="rounded-2xl sm:rounded-3xl border border-red-200/70 bg-white/90 backdrop-blur-sm shadow-xl shadow-red-200/20 dark:border-slate-800 dark:bg-card/90"
          >
            <div className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-700">
              <h3 className="text-lg font-medium text-red-700 dark:text-red-400">
                Thông tin hệ thống
              </h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Phiên bản</dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">v1.0.0</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Cập nhật cuối</dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">2024-12-20</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      Hoạt động bình thường
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Dung lượng DB</dt>
                  <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">2.4 GB</dd>
                </div>
              </dl>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="rounded-2xl sm:rounded-3xl border border-red-200/70 bg-white/90 backdrop-blur-sm shadow-xl shadow-red-200/20 dark:border-slate-800 dark:bg-card/90"
          >
            <div className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-700">
              <h3 className="text-lg font-medium text-red-700 dark:text-red-400">
                Hành động nhanh
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Xuất dữ liệu
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Upload className="h-4 w-4" />
                  Nhập dữ liệu
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Làm mới cache
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Save className="h-4 w-4" />
                  Sao lưu hệ thống
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
