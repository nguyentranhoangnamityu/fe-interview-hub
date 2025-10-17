// Utility functions for code detection and formatting

export interface CodeSegment {
  type: 'text' | 'code' | 'inline-code'
  content: string
  language?: string
}

/**
 * Detects code blocks and inline code in text
 * Supports ```language blocks, `inline code`, and automatic code detection
 */
export const parseTextWithCode = (text: string): CodeSegment[] => {
  const segments: CodeSegment[] = []
  let currentIndex = 0
  
  // Regex patterns
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const inlineCodeRegex = /`([^`]+)`/g
  
  // Find all matches
  const codeBlockMatches = Array.from(text.matchAll(codeBlockRegex))
  const inlineCodeMatches = Array.from(text.matchAll(inlineCodeRegex))
  
  // Combine all matches and sort by position
  const allMatches = [
    ...codeBlockMatches.map(match => ({
      type: 'code-block' as const,
      start: match.index!,
      end: match.index! + match[0].length,
      language: match[1] || 'javascript',
      content: match[2]
    })),
    ...inlineCodeMatches.map(match => ({
      type: 'inline-code' as const,
      start: match.index!,
      end: match.index! + match[0].length,
      content: match[1]
    }))
  ].sort((a, b) => a.start - b.start)
  
  // Process matches
  for (const match of allMatches) {
    // Add text before match
    if (currentIndex < match.start) {
      const textContent = text.slice(currentIndex, match.start)
      if (textContent.trim()) {
        segments.push({
          type: 'text',
          content: textContent
        })
      }
    }
    
    // Add code segment
    if (match.type === 'code-block') {
      segments.push({
        type: 'code',
        content: match.content,
        language: match.language
      })
    } else {
      segments.push({
        type: 'inline-code',
        content: match.content
      })
    }
    
    currentIndex = match.end
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex)
    if (remainingText.trim()) {
      segments.push({
        type: 'text',
        content: remainingText
      })
    }
  }
  
  return segments
}

/**
 * Checks if text contains code patterns
 */
export const containsCode = (text: string): boolean => {
  return /```[\s\S]*?```|`[^`]+`/.test(text)
}

/**
 * Detects code in quiz questions and wraps them in code blocks
 */
export const detectCodeInQuiz = (text: string): CodeSegment[] => {
  const segments: CodeSegment[] = []
  
  // Look for patterns like "console.log('A'); setTimeout(...0); Promise.resolve().then(...); console.log('B')"
  const codePattern = /(console\.log\([^)]+\)[^.!?]*?console\.log\([^)]+\))(?=\s*(?:là gì|là|thì|khi|nào|gì|sao|tại sao))/g
  
  let lastIndex = 0
  let match
  
  while ((match = codePattern.exec(text)) !== null) {
    // Add text before code
    if (match.index > lastIndex) {
      const beforeText = text.slice(lastIndex, match.index)
      if (beforeText.trim()) {
        segments.push({
          type: 'text',
          content: beforeText
        })
      }
    }
    
    // Add code block
    segments.push({
      type: 'code',
      content: match[1].trim(),
      language: 'javascript'
    })
    
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex)
    if (remainingText.trim()) {
      segments.push({
        type: 'text',
        content: remainingText
      })
    }
  }
  
  // If no code found, return the whole text as text
  if (segments.length === 0) {
    segments.push({
      type: 'text',
      content: text
    })
  }
  
  return segments
}
