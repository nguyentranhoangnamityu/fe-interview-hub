import { useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'

export const LoginPage = () => {
  const { user, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate, user])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-200 via-sky-100 to-rose-100 px-3 py-8 sm:px-4 sm:py-12 md:px-6 lg:px-8 lg:py-0 transition-colors duration-500 dark:from-background dark:via-background/90 dark:to-background">
      <div className="absolute right-3 sm:right-6 top-3 sm:top-6 z-20 flex gap-2 sm:gap-3 text-xs sm:text-sm">
        <Link
          className="rounded-full border border-white/80 bg-white/70 px-3 py-1.5 sm:px-4 sm:py-2 font-medium text-slate-700 shadow-sm shadow-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:border-white hover:shadow-lg dark:border-border/60 dark:bg-card/70 dark:text-foreground"
          to="/knowledge-base"
        >
          Xem Knowledge Base
        </Link>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-300/50 blur-3xl opacity-80 sm:h-[28rem] sm:w-[28rem] motion-safe:animate-[blob_28s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-64 w-64 rounded-full bg-sky-200/55 blur-3xl opacity-70 sm:h-80 sm:w-80 motion-safe:animate-[blob_32s_ease-in-out_infinite]" />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-rose-200/55 blur-3xl opacity-75 sm:h-96 sm:w-96 motion-safe:animate-[blob_36s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_55%)] dark:bg-none motion-safe:animate-[pulse-gradient_20s_ease-in-out_infinite]" />
        <div className="absolute inset-0 mix-blend-screen opacity-50 motion-safe:animate-[aurora_36s_ease-in-out_infinite] dark:opacity-35">
          <div className="absolute inset-0 bg-[conic-gradient(from_140deg_at_50%_40%,rgba(248,113,113,0.4),rgba(56,189,248,0.35),rgba(125,211,252,0.3),rgba(196,181,253,0.4),rgba(248,113,113,0.4))]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/18 to-white/10 dark:from-background/40 dark:via-background/70 dark:to-background/20" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 motion-safe:animate-[fade-in_1.1s_ease-out] lg:flex-row lg:items-center">
        <section className="space-y-8 text-center lg:w-1/2 lg:text-left">
          <span className="inline-flex items-center justify-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-primary shadow-sm shadow-primary/10">
            Frontend Interview Hub
          </span>
          <div className="space-y-5">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl dark:text-foreground">
              Nền tảng luyện tập phỏng vấn frontend hiện đại
            </h1>
            <p className="text-base text-slate-600/90 sm:text-lg dark:text-muted-foreground">
              Rèn luyện kỹ năng, luyện tập bài test, và quản lý tiến độ phỏng vấn của bạn ở một nơi duy
              nhất. Đăng nhập để tiếp tục cuộc hành trình chinh phục vị trí Frontend Engineer.
            </p>
          </div>
          <dl className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 text-left shadow-lg shadow-indigo-200/30 backdrop-blur motion-safe:animate-[float_22s_ease-in-out_infinite] dark:border-border/60 dark:bg-card/70">
              <dt className="text-sm font-semibold text-slate-800 dark:text-foreground/80">Practice Hub</dt>
              <dd className="mt-2 text-xs text-slate-500/90 dark:text-muted-foreground">
                Bộ câu hỏi & bài tập cập nhật theo xu hướng tuyển dụng.
              </dd>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 text-left shadow-lg shadow-sky-200/30 backdrop-blur motion-safe:animate-[float_24s_ease-in-out_infinite] dark:border-border/60 dark:bg-card/70">
              <dt className="text-sm font-semibold text-slate-800 dark:text-foreground/80">Progress Tracker</dt>
              <dd className="mt-2 text-xs text-slate-500/90 dark:text-muted-foreground">
                Theo dõi tình trạng ứng tuyển và deadline phỏng vấn của bạn.
              </dd>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-4 text-left shadow-lg shadow-rose-200/30 backdrop-blur motion-safe:animate-[float_26s_ease-in-out_infinite] dark:border-border/60 dark:bg-card/70">
              <dt className="text-sm font-semibold text-slate-800 dark:text-foreground/80">Playbooks</dt>
              <dd className="mt-2 text-xs text-slate-500/90 dark:text-muted-foreground">
                Tài liệu hướng dẫn phỏng vấn thực chiến từ senior engineer.
              </dd>
            </div>
          </dl>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl sm:rounded-3xl border border-white/70 bg-white/85 p-6 sm:p-8 md:p-10 shadow-xl shadow-indigo-200/30 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_70px_-40px_rgba(15,23,42,0.35)] dark:border-border/60 dark:bg-card/90 dark:shadow-black/20 lg:w-5/12">
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-foreground">
              Đăng nhập
            </h2>
            <p className="text-sm text-slate-500/90 dark:text-muted-foreground">
              Sử dụng tài khoản Google của bạn để truy cập Dashboard.
            </p>
          </div>

          <div className="mt-8 flex justify-center motion-safe:animate-[fade-in_1.6s_ease-out]">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const ok = await signInWithGoogle(credentialResponse)
                if (ok) {
                  navigate('/dashboard', { replace: true })
                }
              }}
              onError={() => {
                console.error('Google login failed')
              }}
              shape="pill"
              text="signin_with"
              width="320"
            />
          </div>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-muted-foreground">
            Khi tiếp tục, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật của Frontend Interview
            Hub.
          </p>
        </section>
      </div>
    </div>
  )
}
