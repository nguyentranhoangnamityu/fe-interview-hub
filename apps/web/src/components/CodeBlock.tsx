import React from 'react'

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  language = 'javascript',
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-700 dark:bg-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {language}
            </span>
          </div>
        </div>
        
        {/* Code Content */}
        <div className="overflow-x-auto">
          <pre className="p-4 text-sm leading-relaxed">
            <code className="font-mono text-slate-800 dark:text-slate-200">
              {children}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

interface InlineCodeProps {
  children: string
  className?: string
}

export const InlineCode: React.FC<InlineCodeProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <code className={`rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-slate-800 dark:bg-slate-700 dark:text-slate-200 ${className}`}>
      {children}
    </code>
  )
}
