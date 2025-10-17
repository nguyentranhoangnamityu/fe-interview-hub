import { TrendingUp, Users, BookOpen, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAdmin } from '../providers/AdminProvider'

export const ProgressPage = () => {
  const { stats, lessons, loading } = useAdmin()

  const progressStats = [
    {
      name: 'Tổng học viên',
      value: stats?.totalUsers?.toString() || '0',
      change: `+${stats?.recentSignups || 0}`,
      changeType: 'positive',
      icon: Users,
      color: 'indigo',
    },
    {
      name: 'Bài học hoàn thành',
      value: stats?.totalProgress?.toString() || '0',
      change: '+15',
      changeType: 'positive',
      icon: BookOpen,
      color: 'emerald',
    },
    {
      name: 'Tỷ lệ hoàn thành TB',
      value: `${Math.round(stats?.averageCompletionRate || 0)}%`,
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'sky',
    },
    {
      name: 'Người dùng hoạt động',
      value: stats?.activeUsers?.toString() || '0',
      change: '+8',
      changeType: 'positive',
      icon: Activity,
      color: 'purple',
    },
  ]

  // Tính toán tiến độ theo bài học
  const lessonProgress = lessons.map(lesson => {
    // Mock data - trong thực tế sẽ lấy từ API
    const totalStudents = Math.floor(Math.random() * 100) + 20
    const completed = Math.floor(totalStudents * (0.6 + Math.random() * 0.3))
    const inProgress = Math.floor((totalStudents - completed) * 0.3)
    const notStarted = totalStudents - completed - inProgress
    const completionRate = Math.round((completed / totalStudents) * 100)

    return {
      lesson: lesson.title,
      techStack: lesson.techStack,
      totalStudents,
      completed,
      inProgress,
      notStarted,
      completionRate,
    }
  })

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
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-red-700 dark:text-red-400">Quản lý Tiến độ</h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Theo dõi tiến độ học tập của người dùng
            </p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {progressStats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                className={`rounded-xl sm:rounded-2xl border ${
                  stat.color === 'indigo' ? 'border-indigo-100/60 bg-gradient-to-br from-indigo-500/10 via-indigo-400/10 to-sky-400/10 shadow-indigo-100/40' :
                  stat.color === 'emerald' ? 'border-emerald-300/40 bg-gradient-to-br from-emerald-500/15 to-teal-400/10 shadow-emerald-200/30' :
                  stat.color === 'sky' ? 'border-sky-300/40 bg-gradient-to-br from-sky-500/15 to-indigo-400/10 shadow-sky-200/30' :
                  'border-purple-300/40 bg-gradient-to-br from-purple-500/15 to-pink-400/10 shadow-purple-200/30'
                } p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${
                      stat.color === 'indigo' ? 'text-muted-foreground' :
                      stat.color === 'emerald' ? 'text-emerald-500' :
                      stat.color === 'sky' ? 'text-sky-500' :
                      'text-purple-500'
                    }`}>
                      {stat.name}
                    </p>
                    <p className={`mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold ${
                      stat.color === 'indigo' ? 'text-indigo-700 dark:text-foreground' :
                      stat.color === 'emerald' ? 'text-emerald-500' :
                      stat.color === 'sky' ? 'text-sky-500' :
                      'text-purple-500'
                    }`}>
                      {loading ? '...' : stat.value}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${
                    stat.color === 'indigo' ? 'text-indigo-500' :
                    stat.color === 'emerald' ? 'text-emerald-500' :
                    stat.color === 'sky' ? 'text-sky-500' :
                    'text-purple-500'
                  }`}>
                    <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Table */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="rounded-2xl sm:rounded-3xl border border-red-200/70 bg-white/90 backdrop-blur-sm shadow-xl shadow-red-200/20 dark:border-slate-800 dark:bg-card/90 overflow-hidden"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-4">
                Tiến độ theo bài học
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-slate-800 dark:to-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Bài học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Tech Stack
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Tổng học viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Hoàn thành
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Đang học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Chưa bắt đầu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Tỷ lệ hoàn thành
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                    {lessonProgress.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.lesson}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            {item.techStack}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {item.totalStudents}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          <span className="text-green-600 font-medium">{item.completed}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          <span className="text-yellow-600 font-medium">{item.inProgress}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          <span className="text-red-600 font-medium">{item.notStarted}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${item.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{item.completionRate}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
