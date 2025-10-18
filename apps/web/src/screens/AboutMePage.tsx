import type { JSX } from 'react'
import { Button } from '@fehub/ui'
import { Link } from 'react-router-dom'

const contact = {
  name: 'Nguyen Tran Hoang Nam',
  location: 'Ho Chi Minh City, Vietnam',
  email: 'hoangnamnguyentranlapvo9a1@gmail.com',
  phone: '0914 332 606',
  linkedin: 'https://linkedin.com/in/nguyen-nam-60886a139',
  summary:
    'Frontend Developer with 4+ years of experience shipping scalable, high-performance React applications. Strong focus on UI/UX optimisation, realtime integrations, and production-grade architecture. Proven collaborator in Agile/Scrum teams, contributing to both feature development and performance/security improvements.',
}

const quickFacts = [
  { label: 'Experience', value: '4+ years crafting production-ready products' },
  { label: 'Industries', value: 'Banking | CRM | EdTech' },
  { label: 'Methodologies', value: 'Agile/Scrum | Product-Led' },
]

type PrimaryTech = {
  name: string
  caption: string
  icon: JSX.Element
  glow: string
  href?: string
}

const techStack: PrimaryTech[] = [
  {
    name: 'React JS',
    caption: '',
    icon: (
      <img
        src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg"
        alt="React logo"
        className="h-16 w-16 object-contain"
        loading="lazy"
      />
    ),
    glow: 'shadow-[0_35px_60px_-25px_rgba(97,218,251,0.55)]',
    href: 'https://react.dev/',
  },
  {
    name: 'TypeScript',
    caption: '',
    icon: (
      <img
        src="https://www.svgrepo.com/show/374144/typescript.svg"
        alt="TypeScript logo"
        className="h-16 w-16 object-contain"
        loading="lazy"
      />
    ),
    glow: 'shadow-[0_35px_60px_-25px_rgba(49,120,198,0.55)]',
    href: 'https://www.typescriptlang.org/',
  },
  {
    name: 'JavaScript',
    caption: '',
    icon: (
      <img
        src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
        alt="JavaScript logo"
        className="h-16 w-16 object-contain"
        loading="lazy"
      />
    ),
    glow: 'shadow-[0_35px_60px_-25px_rgba(247,223,30,0.45)]',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  {
    name: 'Redux Toolkit',
    caption: '',
    icon: (
      <img
        src="https://repository-images.githubusercontent.com/347723622/92065800-865a-11eb-9626-dff3cb7fef55"
        alt="Redux Toolkit logo"
        className="h-16 w-16 object-contain"
        loading="lazy"
      />
    ),
    glow: 'shadow-[0_35px_60px_-25px_rgba(118,74,188,0.55)]',
    href: 'https://redux-toolkit.js.org/',
  },
  {
    name: 'React Query',
    caption: '',
    icon: (
      <img
        src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/2/react-query-icon-xjukes5xosrrwg3y3ics1f.png/react-query-icon-2dw36yx2b016w37mbipyn.png?_a=DATAg1AAZAA0"
        alt="React Query logo"
        className="h-16 w-16 object-contain"
        loading="lazy"
      />
    ),
    glow: 'shadow-[0_35px_60px_-25px_rgba(255,165,0,0.45)]',
    href: 'https://tanstack.com/query/latest',
  },
  {
    name: 'TailwindCSS',
    caption: '',
    icon: (
      <img
        src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg"
        alt="TailwindCSS logo"
        className="h-16 w-16 object-contain"
        loading="lazy"
      />
    ),
    glow: 'shadow-[0_35px_60px_-25px_rgba(6,182,212,0.55)]',
    href: 'https://tailwindcss.com/',
  },
  {
    name: 'Storybook',
    caption: '',
    icon: (
      <img
        src="https://raw.githubusercontent.com/devicons/devicon/master/icons/storybook/storybook-original.svg"
        alt="Storybook logo"
        className="h-16 w-16 object-contain"
        loading="lazy"
      />
    ),
    glow: 'shadow-[0_35px_60px_-25px_rgba(255,84,166,0.55)]',
    href: 'https://storybook.js.org/',
  },
  {
    name: 'ShadCN/UI',
    caption: '',
    icon: (
      <img
        src="https://ui.shadcn.com/apple-touch-icon.png"
        alt="ShadCN/UI logo"
        className="h-16 w-16 object-contain"
        loading="lazy"
      />
    ),
    glow: 'shadow-[0_35px_60px_-25px_rgba(71,85,105,0.45)]',
    href: 'https://ui.shadcn.com/',
  },
  {
    name: 'Turborepo',
    caption: '',
    icon: (
      <img
        src="https://files.svgcdn.io/logos/turborepo-icon.png"
        alt="Turborepo logo"
        className="h-16 w-16 object-contain"
        loading="lazy"
      />
    ),
    glow: 'shadow-[0_35px_60px_-25px_rgba(147,51,234,0.55)]',
    href: 'https://turbo.build/',
  },
]

const experiences = [
  {
    role: 'Frontend Developer - CRM v4',
    company: 'Base Business Solutions',
    timeframe: 'Jan 2025 - Present | Ho Chi Minh City',
    highlights: [
      'Designed and bootstrapped the monorepo architecture with pnpm + Turborepo for modular, scalable development.',
      'Implemented the modern frontend stack (TypeScript, Redux Toolkit, React Query, Storybook, ShadCN/UI) to drive reusability and performance.',
      'Improved load time through code splitting, lazy loading, and API caching; reduced bundle size significantly.',
      'Managed WebSocket connections for 200+ concurrent call center agents, lowering API load on critical workflows.',
      'Ensured compliance with banking security standards by addressing vulnerabilities surfaced in security scans.',
      'Mentored junior developers, steering the team toward best practices and mature Agile/Scrum rituals.',
    ],
    techStack:
      'ReactJS, TypeScript, Redux Toolkit, React Query, Storybook, ShadCN/UI, TailwindCSS, WebSocket, pnpm, Turborepo',
  },
  {
    role: 'Frontend Developer - CRM v3',
    company: 'Base Business Solutions',
    timeframe: 'Aug 2020 - Present | Ho Chi Minh City',
    highlights: [
      'Built and maintained CRM v3 for enterprise banking clients (Vietinbank, Sacombank, BVBank, Eximbank, DongA Bank, VietABank, NCB).',
      'Architected the base source and contributed roughly 40% of the overall codebase.',
      'Delivered responsive, stable experiences supporting up to 1,000 concurrent users.',
      'Optimised API usage by cutting redundant calls, adding caching, and introducing Redux-Saga middleware.',
      'Translated complex banking workflows into user-friendly interfaces in collaboration with stakeholders.',
    ],
    techStack: 'ReactJS, JavaScript, Redux, Redux-Saga, HTML, SCSS',
    clients: [
      { name: 'Vietinbank', abbr: 'VTB', colors: 'from-sky-500 via-sky-600 to-sky-700', logo: '/logo-vtb.jpg' },
      { name: 'Sacombank', abbr: 'SCB', colors: 'from-blue-500 via-blue-600 to-blue-700', logo: '/logo-sacombank.jpg' },
      { name: 'BVBank', abbr: 'BVB', colors: 'from-amber-500 via-amber-600 to-amber-700', logo: '/logo-bvb.jpg' },
      { name: 'Eximbank', abbr: 'EXB', colors: 'from-cyan-500 via-cyan-600 to-cyan-700', logo: '/logo-eximbank.png' },
      { name: 'DongA Bank', abbr: 'DAB', colors: 'from-orange-500 via-orange-600 to-orange-700', logo: '/logo-dong-a-bank.jpg' },
      { name: 'VietABank', abbr: 'VAB', colors: 'from-rose-500 via-rose-600 to-rose-700', logo: '/logo-viet-a-bank.png' },
      { name: 'NCB', abbr: 'NCB', colors: 'from-purple-500 via-purple-600 to-purple-700', logo: '/logo-ncb.jpg' },
    ],
  },
  {
    role: 'Frontend Developer Intern',
    company: 'ACEXIS JSC',
    timeframe: 'Jan 2020 - Jul 2020 | Ho Chi Minh City',
    highlights: [
      'Contributed to multiple web applications: LMS, Lunch Management App, Translation Platform, Ticket Booking, Video Course Module.',
      'Handled analysis, UI/UX design, implementation, bug fixing, and testing workflows.',
      'Explored full-stack integrations with NestJS, GraphQL, and MongoDB for certain deliveries.',
      'Worked both independently and within squads of 5-7 members, developing strong teamwork and autonomy.',
      'Built a solid foundation in component-based architecture and agile delivery.',
    ],
    techStack: 'ReactJS, AngularJS, HTML, SCSS, NestJS, GraphQL, MongoDB',
  },
]

const education = {
  school: 'International University - Vietnam National University',
  degree: 'Bachelor of Computer Science',
  timeframe: 'Sep 2016 - Sep 2020',
  gpa: 'GPA 3.0 / 4.0',
}

const skills = [
  {
    title: 'Technical',
    items: [
      'ReactJS, TypeScript, JavaScript (ES6+)',
      'Redux Toolkit, Redux-Saga, React Query',
      'Storybook, ShadCN/UI, TailwindCSS',
      'HTML5, SCSS, CSS3',
      'WebSocket integrations, Monorepo workflows',
    ],
  },
  {
    title: 'Soft Skills',
    items: [
      'Leadership and mentorship',
      'Agile Scrum facilitation',
      'Problem solving & critical thinking',
      'Stakeholder communication and collaboration',
      'Time management, adaptability, conflict resolution',
    ],
  },
  {
    title: 'Languages',
    items: ['Vietnamese - Full professional proficiency', 'English - Limited working proficiency'],
  },
]

const projects = [
  {
    name: 'Banking CRM Solutions (CRM v3 & v4)',
    timeframe: 'Oct 2020 - Present',
    contributions: [
      'Designed the base architecture for CRM v3 (responsible for ~40% of the codebase) and prepared CRM v4 with a monorepo foundation.',
      'Delivered CRM solutions adopted by major Vietnamese banks (Vietinbank, Sacombank, BVBank, Eximbank, DongA Bank, VietABank, NCB).',
      'Supported up to 1,000 concurrent users while meeting strict security requirements.',
      'Optimised frontend performance via caching, code-splitting, lazy loading, and WebSocket management for 200+ agents.',
    ],
    techStack:
      'ReactJS, TypeScript, Redux Toolkit, React Query, Redux-Saga, Storybook, ShadCN/UI, Turborepo, WebSocket',
  },
  {
    name: 'Video-based Course Management Module',
    timeframe: 'Jan 2025 - Jul 2025',
    contributions: [
      'Developed an end-to-end module for course creation, lecture uploads, tests, and learning progress tracking.',
      'Enabled students to authenticate, manage learning progress, and review their history.',
      'Owned the full lifecycle from design to deployment.',
    ],
    techStack: 'ReactJS, HTML, SCSS',
    team: 'Individual contributor | Role: Frontend Developer',
  },
  {
    name: 'Learning Management System (LMS)',
    timeframe: 'Jan 2020 - Jul 2025',
    contributions: [
      'Built a distance learning platform with course discovery, enrolment, and completion tracking.',
      'Delivered reporting features for managers, including analytics and user management.',
      'Participated in analysis, UI design, frontend development, and QA.',
    ],
    techStack: 'ReactJS, HTML, SCSS',
    team: 'Team size 7 | Role: Frontend Developer',
  },
  {
    name: 'Translate Web App',
    timeframe: 'Jan 2020 - Jul 2020',
    contributions: [
      'Created a marketplace for translators to find content, submit translations, and receive payments.',
      'Improved UX through iterative bug fixing and enhancements.',
    ],
    techStack: 'ReactJS, HTML, SCSS',
    team: 'Team size 5 | Role: Frontend Developer',
  },
  {
    name: 'Ticket Booking Website',
    timeframe: 'Mar 2020 - Jun 2020',
    contributions: [
      'Implemented end-to-end booking flows with seat selection, payment integration, and confirmation email handling.',
      'Collaborated with backend engineers to define GraphQL contracts and ensure performant data fetching.',
      'Optimised responsive layouts to provide a consistent experience across desktop and mobile browsers.',
    ],
    techStack: 'ReactJS, HTML, SCSS, GraphQL',
    team: 'Team size 5 | Role: Frontend Developer',
  },
  {
    name: 'Lunch Management Web App',
    timeframe: 'Jan 2020 - Feb 2020',
    contributions: [
      'Developed a full-stack application for employees to pre-order lunch, simplifying HR processes.',
      'Handled requirements analysis, UI/UX, implementation, testing, and maintenance.',
    ],
    techStack: 'ReactJS, SCSS, NestJS, GraphQL, MongoDB',
    team: 'Individual contributor | Role: Fullstack Developer',
  },
]

const callToActions = [
  {
    title: 'Download CV (PDF)',
    href: '/CV_NguyenTranHoangNam.pdf',
    download: true,
    variant: 'default',
    className: 'bg-white text-slate-900 hover:bg-indigo-50 dark:bg-slate-100 dark:text-slate-900',
  },
  {
    title: 'Email Me',
    href: `mailto:${contact.email}`,
    variant: 'default',
    className:
      'border-indigo-300/70 text-indigo-100 hover:bg-indigo-500/10 hover:text-white dark:border-indigo-500/40 dark:text-indigo-200',
  },
  {
    title: 'Connect on LinkedIn',
    href: contact.linkedin,
    variant: 'default',
    className:
      'border-indigo-300/70 text-indigo-100 hover:bg-indigo-500/10 hover:text-white dark:border-indigo-500/40 dark:text-indigo-200',
  },
]

export const AboutMePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <div className="flex justify-center lg:justify-start">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-indigo-200">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-white/10 p-10 shadow-[0_40px_80px_-20px_rgba(79,70,229,0.45)] backdrop-blur-2xl dark:bg-white/5">
          <div className="absolute top-0 right-0 h-72 w-72 -translate-y-16 translate-x-16 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-7 text-white">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/40 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.4em] text-indigo-200">
                  About Me
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.35em] text-indigo-100">
                  Frontend Developer
                </span>
              </div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{contact.name}</h1>
              <p className="text-base leading-relaxed text-indigo-100 sm:text-lg">{contact.summary}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200/90">
                {quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] text-indigo-100 shadow-sm shadow-indigo-500/20 transition hover:bg-white/10"
                  >
                    <span className="text-indigo-200">{fact.label}:</span> <span className="text-white">{fact.value}</span>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 text-sm text-indigo-100/90 sm:grid-cols-2">
                <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Location</p>
                  <p>{contact.location}</p>
                </div>
                <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Contact</p>
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                </div>
                <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">LinkedIn</p>
                  <a href={contact.linkedin} className="text-indigo-200 underline" target="_blank" rel="noopener noreferrer">
                    {contact.linkedin}
                  </a>
                </div>
                <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Availability</p>
                  <p>Open to product-focused frontend roles</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {callToActions.map((cta) => (
                  <Button
                    key={cta.title}
                    variant={(cta.variant as 'default' | 'outline' | 'ghost' | 'secondary' | 'link') ?? 'outline'}
                    className={cta.className}
                    asChild
                  >
                    <a href={cta.href} download={cta.download}>
                      {cta.title}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-indigo-50 shadow-xl shadow-indigo-900/40">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="relative flex flex-col gap-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200">
                  Tech Stack
                </span>
                <h3 className="text-2xl font-semibold text-white">Technologies I work with</h3>
                <p className="text-sm text-indigo-100/85">
                  From frontend frameworks to build tools, this comprehensive stack powers every product experience I build.
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {techStack.map((tech, index) => (
                    <div
                      key={tech.name}
                      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-indigo-100 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.4)] ${tech.glow}`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      title={tech.name}
                    >
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-xl" />
                      <div className="relative flex flex-col items-center gap-4 text-center">
                        <div className="relative h-20 w-20 flex-shrink-0">
                          {tech.href ? (
                            <a
                              href={tech.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/logo flex h-full w-full items-center justify-center rounded-2xl bg-slate-950/80 ring-1 ring-white/20 shadow-inner shadow-black/30 transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-3"
                              title={tech.name}
                            >
                              {tech.icon}
                            </a>
                          ) : (
                            <div 
                              className="group/logo flex h-full w-full items-center justify-center rounded-2xl bg-slate-950/80 ring-1 ring-white/20 shadow-inner shadow-black/30 transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-3"
                              title={tech.name}
                            >
                              {tech.icon}
                            </div>
                          )}
                          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-white/10 opacity-0 blur-lg transition duration-500 group-hover:opacity-40" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-indigo-100/90">
                  <span className="font-semibold text-white">Core Strength:</span> Architecting React ecosystems that balance
                  scalability, performance, and usability.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-white/5 p-8 text-indigo-50 shadow-xl shadow-indigo-950/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Work Experience</h2>
              <p className="text-sm text-indigo-100/90">
                Experience designing, building, and scaling mission-critical web applications for enterprise banking clients and fast-paced
                product teams.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-indigo-200">
              Agile | Scrum | Product-led
            </div>
          </div>
          <div className="mt-8 space-y-10">
            {experiences.map((item) => (
              <article key={`${item.role}-${item.company}`} className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 lg:grid-cols-[1fr_2fr]">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">{item.timeframe}</p>
                  <h3 className="text-xl font-semibold text-white">{item.role}</h3>
                  <p className="text-sm text-indigo-100/80">{item.company}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">Key Contributions</p>
                </div>
                <div className="space-y-5">
                  <ul className="space-y-3 text-sm text-indigo-100/90">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 translate-y-1 rounded-full bg-indigo-300" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-indigo-200">
                    <span className="font-semibold text-white">Tech Stack:</span> {item.techStack}
                  </div>
                  {/* {item.clients ? (
                    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                        Enterprise Clients
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {item.clients.map((client) => (
                          <figure
                            key={client.name}
                            className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/90 p-4 text-center shadow-[0_20px_48px_-24px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:shadow-[0_28px_56px_-20px_rgba(79,70,229,0.45)] dark:bg-slate-950/80"
                          >
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-slate-950/5 ring-1 ring-white/20 dark:bg-slate-900">
                              <img
                                src={client.logo}
                                alt={`${client.name} logo`}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                            <figcaption className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                              {client.name}
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    </div>
                  ) : null} */}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-8 text-indigo-50 shadow-xl shadow-indigo-950/40">
            <h2 className="text-2xl font-semibold text-white">Highlighted Projects</h2>
            <div className="mt-6 space-y-6">
              {projects.slice(0, 2).map((project) => (
                <div key={project.name} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">{project.timeframe}</p>
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-indigo-100/90">
                    {project.contributions.map((contribution) => (
                      <li key={contribution} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 translate-y-1 rounded-full bg-indigo-300" />
                        <span>{contribution}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 text-xs text-indigo-200">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Stack</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{project.techStack}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-indigo-50 shadow-xl shadow-indigo-950/40">
              <h3 className="text-xl font-semibold text-white">Education</h3>
              <p className="mt-2 text-sm text-indigo-100/85">{education.degree}</p>
              <p className="text-sm text-indigo-100/70">{education.school}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">{education.timeframe}</p>
              <p className="mt-3 text-sm text-indigo-100/85">{education.gpa}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-indigo-50 shadow-xl shadow-indigo-950/40">
              <h3 className="text-xl font-semibold text-white">Languages</h3>
              <ul className="mt-4 space-y-2 text-sm text-indigo-100/85">
                {skills[2].items.map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-white/5 p-8 text-indigo-50 shadow-xl shadow-indigo-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-2xl font-semibold text-white">Skills Snapshot</h2>
              <p className="text-sm text-indigo-100/85">
                A blend of technical depth and collaborative leadership, honed through delivering complex CRM platforms and data-intensive
                web experiences.
              </p>
            </div>
            <Button variant="ghost" asChild>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-200">
                View Recommendations
              </a>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.slice(0, 2).map((group) => (
              <div key={group.title} className="space-y-3 rounded-3xl border border-white/5 bg-white/5 p-6 text-indigo-100 shadow-inner shadow-indigo-500/5">
                <p className="text-lg font-semibold text-white">{group.title}</p>
                <ul className="space-y-2 text-sm text-indigo-100/85">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 translate-y-1 rounded-full bg-indigo-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-white/5 p-8 text-indigo-50 shadow-xl shadow-indigo-900/40">
          <h2 className="text-2xl font-semibold text-white">Additional Projects</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {projects.slice(2).map((project) => (
              <div key={project.name} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">{project.timeframe}</p>
                  <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  {project.team ? <p className="text-xs text-indigo-100/70">{project.team}</p> : null}
                </div>
                <ul className="space-y-2 text-sm text-indigo-100/90">
                  {project.contributions.map((contribution) => (
                    <li key={contribution} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 translate-y-1 rounded-full bg-indigo-300" />
                      <span>{contribution}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-indigo-200">
                  <span className="font-semibold text-white">Tech Stack:</span> {project.techStack}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-white/5 p-8 text-indigo-50 shadow-xl shadow-indigo-900/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-semibold text-white">Full CV Preview</h2>
              <p className="text-sm text-indigo-100/90">
                Review the complete CV for role history, project details, and certifications. Updated as of {new Date().getFullYear()}.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href="/CV_NguyenTranHoangNam.pdf" download>
                    Download CV (PDF)
                  </a>
                </Button>
                <Button variant="default" asChild>
                  <a href="/CV_NguyenTranHoangNam.pdf" target="_blank" rel="noopener noreferrer">
                    Open in new tab
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-inner shadow-indigo-500/10">
              <iframe
                src="/CV_NguyenTranHoangNam.pdf"
                title="CV Nguyen Tran Hoang Nam"
                className="h-[480px] w-full"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
