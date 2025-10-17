import { useMemo } from 'react'
import { Button } from '@fehub/ui'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

import { useAuth } from '../providers/AuthProvider'
import { useKnowledgeBase } from '../providers/KnowledgeBaseProvider'
import { ParticlesBackground } from '../components/ParticlesBackground'
import { AnimatedCard } from '../components/AnimatedCard'
import { AnimatedCounter } from '../components/AnimatedCounter'

export const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { lessons, progress, getLessonProgress } = useKnowledgeBase()

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const lessonStats = useMemo(() => {
    const totalLessons = lessons.length
    const completedLessons = Object.values(progress).filter(
      (item) => item.status === 'completed',
    ).length
    const inProgressLessons = Object.values(progress).filter(
      (item) => item.status === 'in_progress',
    ).length
    const recentlyUpdated = Object.entries(progress)
      .map(([lessonId, record]) => {
        const lesson = lessons.find((item) => item.id === lessonId)
        if (!lesson) {
          return null
        }
        const summary = getLessonProgress(lessonId)
        return {
          lesson,
          record,
          percent: Math.round(summary.completionRate * 100),
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => (a.record.updatedAt < b.record.updatedAt ? 1 : -1))
      .slice(0, 3)

    return {
      totalLessons,
      completedLessons,
      inProgressLessons,
      recentlyUpdated,
    }
  }, [getLessonProgress, lessons, progress])

  // Dữ liệu cho các chart
  const chartData = useMemo(() => {
    // Dữ liệu cho pie chart (phân bố trạng thái bài học)
    const pieData = [
      { name: 'Hoàn thành', value: lessonStats.completedLessons, color: '#10b981' },
      { name: 'Đang học', value: lessonStats.inProgressLessons, color: '#3b82f6' },
      { name: 'Chưa học', value: lessonStats.totalLessons - lessonStats.completedLessons - lessonStats.inProgressLessons, color: '#6b7280' },
    ]

    // Dữ liệu cho line chart (tiến độ học tập theo thời gian)
    const lineData = [
      { name: 'Tuần 1', completed: 2, inProgress: 3 },
      { name: 'Tuần 2', completed: 5, inProgress: 2 },
      { name: 'Tuần 3', completed: 8, inProgress: 4 },
      { name: 'Tuần 4', completed: 12, inProgress: 3 },
      { name: 'Tuần 5', completed: lessonStats.completedLessons, inProgress: lessonStats.inProgressLessons },
    ]

    // Dữ liệu cho bar chart (thống kê theo tags)
    const tagStats = lessons.reduce((acc, lesson) => {
      const primaryTag = lesson.tags[0] || 'Khác'
      if (!acc[primaryTag]) {
        acc[primaryTag] = { total: 0, completed: 0 }
      }
      acc[primaryTag].total++
      if (progress[lesson.id]?.status === 'completed') {
        acc[primaryTag].completed++
      }
      return acc
    }, {} as Record<string, { total: number; completed: number }>)

    const barData = Object.entries(tagStats).map(([tag, stats]) => ({
      name: tag,
      completed: stats.completed,
      total: stats.total,
      completionRate: Math.round((stats.completed / stats.total) * 100),
    }))

    return { pieData, lineData, barData }
  }, [lessonStats, lessons, progress])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-foreground">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-8rem] h-[20rem] w-[20rem] rounded-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 blur-3xl animate-pulse" />
        <div className="absolute -right-24 bottom-[-10rem] h-[22rem] w-[22rem] rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-400/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[30rem] rounded-full bg-gradient-to-r from-pink-400/20 to-indigo-400/20 blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_60%)] dark:bg-none" />
      </div>
      
      {/* Particles Background - Disabled */}
      {/* <ParticlesBackground /> */}
      
      <div className="relative flex min-h-screen flex-col">
        <main className="flex w-full flex-1 flex-col gap-4 sm:gap-6 px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
          {/* Stats Cards */}
          <AnimatedCard delay={0.05}>
            <section className="rounded-2xl sm:rounded-3xl border border-indigo-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-indigo-200/20 dark:border-slate-800 dark:bg-card/90">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Tổng quan</h2>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Theo dõi tiến độ học tập và quay lại knowledge base để hoàn thiện lộ trình phỏng vấn của bạn.
                </p>
              </motion.div>
              
              <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatedCard delay={0.4} className="rounded-xl sm:rounded-2xl border border-indigo-100/60 bg-gradient-to-br from-indigo-500/10 via-indigo-400/10 to-sky-400/10 p-4 sm:p-5 shadow-md shadow-indigo-100/40 dark:border-slate-700 dark:bg-slate-900/60 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Tổng số bài học
                      </p>
                      <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-indigo-700 dark:text-foreground">
                        <AnimatedCounter value={lessonStats.totalLessons} />
                      </p>
                    </div>
                    <div className="text-indigo-500">
                      <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </AnimatedCard>
                
                <AnimatedCard delay={0.5} className="rounded-xl sm:rounded-2xl border border-emerald-300/40 bg-gradient-to-br from-emerald-500/15 to-teal-400/10 p-4 sm:p-5 shadow-md shadow-emerald-200/30 dark:border-emerald-500/30 dark:bg-emerald-500/10 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                        Đã hoàn thành
                      </p>
                      <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-emerald-500">
                        <AnimatedCounter value={lessonStats.completedLessons} />
                      </p>
                    </div>
                    <div className="text-emerald-500">
                      <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </AnimatedCard>
                
                <AnimatedCard delay={0.6} className="rounded-xl sm:rounded-2xl border border-sky-300/40 bg-gradient-to-br from-sky-500/15 to-indigo-400/10 p-4 sm:p-5 shadow-md shadow-sky-200/30 dark:border-sky-500/30 dark:bg-sky-500/10 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                        Đang học
                      </p>
                      <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-sky-500">
                        <AnimatedCounter value={lessonStats.inProgressLessons} />
                      </p>
                    </div>
                    <div className="text-sky-500">
                      <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Button asChild className="mt-6" variant="default">
                  <Link to="/knowledge-base">Mở Knowledge Base</Link>
                </Button>
              </motion.div>
            </section>
          </AnimatedCard>

          {/* Charts Section */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
            {/* Pie Chart - Phân bố trạng thái bài học */}
            <AnimatedCard delay={0.2}>
              <section className="rounded-2xl sm:rounded-3xl border border-indigo-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-indigo-200/20 dark:border-slate-800 dark:bg-card/90 hover:shadow-lg transition-all duration-300">
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Phân bố trạng thái bài học</h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                    Tỷ lệ các bài học theo trạng thái hoàn thành
                  </p>
                </motion.div>
                <div className="mt-4 sm:mt-6 h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {chartData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </AnimatedCard>

            {/* Line Chart - Tiến độ học tập */}
            <AnimatedCard delay={0.25}>
              <section className="rounded-2xl sm:rounded-3xl border border-indigo-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-indigo-200/20 dark:border-slate-800 dark:bg-card/90 hover:shadow-lg transition-all duration-300">
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Tiến độ học tập theo thời gian</h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                    Biểu đồ theo dõi số lượng bài học hoàn thành và đang học
                  </p>
                </motion.div>
                <div className="mt-4 sm:mt-6 h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                      <XAxis dataKey="name" stroke="rgba(99, 102, 241, 0.6)" />
                      <YAxis stroke="rgba(99, 102, 241, 0.6)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Hoàn thành"
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                        animationBegin={0}
                        animationDuration={1500}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="inProgress" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Đang học"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                        animationBegin={500}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </AnimatedCard>
          </div>

          {/* Bar Chart - Thống kê theo tags */}
          <AnimatedCard delay={0.3}>
            <section className="rounded-2xl sm:rounded-3xl border border-indigo-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-indigo-200/20 dark:border-slate-800 dark:bg-card/90 hover:shadow-lg transition-all duration-300">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Thống kê theo tags</h2>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Số lượng bài học hoàn thành theo từng tag kiến thức
                </p>
              </motion.div>
              <div className="mt-4 sm:mt-6 h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                    <XAxis dataKey="name" stroke="rgba(99, 102, 241, 0.6)" />
                    <YAxis stroke="rgba(99, 102, 241, 0.6)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="completed" 
                      fill="#10b981" 
                      name="Hoàn thành"
                      radius={[4, 4, 0, 0]}
                      animationBegin={0}
                      animationDuration={1200}
                    />
                    <Bar 
                      dataKey="total" 
                      fill="#e5e7eb" 
                      name="Tổng số"
                      radius={[4, 4, 0, 0]}
                      animationBegin={300}
                      animationDuration={1200}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </AnimatedCard>
          
          {/* Recent Progress */}
          <AnimatedCard delay={0.35}>
            <section className="rounded-2xl sm:rounded-3xl border border-indigo-200/70 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-indigo-200/20 dark:border-slate-800 dark:bg-card/90 hover:shadow-lg transition-all duration-300">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.3 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0"
              >
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Tiến độ học gần đây</h2>
                <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
                  <Link to="/knowledge-base">Xem thư viện</Link>
                </Button>
              </motion.div>
              
              {lessonStats.recentlyUpdated.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <p className="mt-4 text-sm text-muted-foreground">
                    Bắt đầu đánh dấu các mục kiến thức trong knowledge base để xem thống kê tại đây.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="mt-6 space-y-4"
                >
                  {lessonStats.recentlyUpdated.map(({ lesson, record, percent }, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl sm:rounded-2xl border border-indigo-100/70 bg-gradient-to-r from-white/80 to-indigo-50/60 px-3 sm:px-4 py-3 text-sm shadow-sm shadow-indigo-100/40 dark:border-slate-700 dark:bg-slate-900/60 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Cập nhật {new Date(record.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-2 sm:px-3 py-1 text-xs font-semibold uppercase ${
                          record.status === 'completed'
                            ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-400/25 text-emerald-600'
                            : record.status === 'in_progress'
                            ? 'bg-gradient-to-r from-sky-500/15 via-indigo-500/20 to-indigo-500/25 text-sky-600'
                            : 'border border-slate-200/70 bg-white/70 text-slate-500 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-300'
                        }`}
                      >
                        {record.status === 'completed'
                          ? '✓ Hoàn thành'
                          : record.status === 'in_progress'
                          ? '⏳ Đang học'
                          : '→ Chưa học'}
                      </span>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs font-semibold text-slate-600 dark:text-foreground">
                          <AnimatedCounter value={percent} />
                          %
                        </span>
                        <Button asChild size="sm" variant="secondary" className="text-xs">
                          <Link to={`/knowledge-base/${lesson.id}`}>Chi tiết</Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                  ))}
                </motion.div>
              )}
            </section>
          </AnimatedCard>
        </main>
      </div>
    </div>
  )
}
