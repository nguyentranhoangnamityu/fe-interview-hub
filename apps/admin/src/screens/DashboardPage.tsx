import { 
  BookOpen, 
  Users, 
  BarChart3, 
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  UserPlus
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAdmin } from '../providers/AdminProvider'
import { useEffect } from 'react'

export const DashboardPage = () => {
  const { stats, activities, loading, activitiesLoading } = useAdmin()

  // Debug log
  console.log('DashboardPage: activities =', activities, 'type =', typeof activities, 'isArray =', Array.isArray(activities))

  // Safety check to ensure activities is an array
  const safeActivities = Array.isArray(activities) ? activities : []

  const statsData = [
    {
      name: 'Tổng bài học',
      value: stats?.totalLessons?.toString() || '0',
      change: '+2',
      changeType: 'positive',
      icon: BookOpen,
      color: 'indigo',
    },
    {
      name: 'Người dùng',
      value: stats?.totalUsers?.toString() || '0',
      change: `+${stats?.recentSignups || 0}`,
      changeType: 'positive',
      icon: Users,
      color: 'emerald',
    },
    {
      name: 'Hoàn thành',
      value: `${Math.round(stats?.averageCompletionRate || 0)}%`,
      change: '+5%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'sky',
    },
    {
      name: 'Người dùng hoạt động',
      value: stats?.activeUsers?.toString() || '0',
      change: '+3',
      changeType: 'positive',
      icon: Clock,
      color: 'purple',
    },
  ]

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
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-red-700 dark:text-red-400">Dashboard Admin</h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Tổng quan về hệ thống FE Interview Hub
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {statsData.map((stat, index) => (
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

          {/* Charts and Activities */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
            {/* Chart placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="rounded-2xl sm:rounded-3xl border border-red-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-red-200/20 dark:border-slate-800 dark:bg-card/90 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-red-700 dark:text-red-400 mb-4">
                Thống kê hoạt động
              </h3>
              <div className="h-64 bg-gradient-to-br from-red-50/50 to-pink-50/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-red-400 mx-auto mb-2" />
                  <span className="text-red-500 text-sm">Biểu đồ sẽ được thêm sau</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="rounded-2xl sm:rounded-3xl border border-red-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-red-200/20 dark:border-slate-800 dark:bg-card/90 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-red-700 dark:text-red-400 mb-4">
                Hoạt động gần đây
              </h3>
              <div className="flow-root">
                {activitiesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                  </div>
                ) : safeActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-red-400 mx-auto mb-2" />
                    <span className="text-red-500 text-sm">Chưa có hoạt động nào</span>
                  </div>
                ) : (
                  <ul className="-mb-8">
                    {safeActivities.map((activity, activityIdx) => (
                      <motion.li
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + activityIdx * 0.1, duration: 0.3 }}
                      >
                        <div className="relative pb-8">
                          {activityIdx !== safeActivities.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-red-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                                <Activity className="h-4 w-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{activity.message}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-slate-500 dark:text-slate-400">
                                {new Date(activity.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
