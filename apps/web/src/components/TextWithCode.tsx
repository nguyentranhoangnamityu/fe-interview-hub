import React from 'react'
import { CodeBlock, InlineCode } from '../components/CodeBlock'
import { parseTextWithCode, type CodeSegment } from '../utils/codeUtils'

interface TextWithCodeProps {
  children: string
  className?: string
}

export const TextWithCode: React.FC<TextWithCodeProps> = ({ 
  children, 
  className = '' 
}) => {
  const segments = parseTextWithCode(children)
  
  return (
    <div className={className}>
      {segments.map((segment: CodeSegment, index: number) => {
        switch (segment.type) {
          case 'code':
            return (
              <CodeBlock 
                key={index} 
                language={segment.language}
                className="my-4"
              >
                {segment.content}
              </CodeBlock>
            )
          case 'inline-code':
            return (
              <InlineCode key={index}>
                {segment.content}
              </InlineCode>
            )
          case 'text':
          default:
            return (
              <span key={index}>
                {segment.content}
              </span>
            )
        }
      })}
    </div>
  )
}
