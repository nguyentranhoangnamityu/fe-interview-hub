import { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from '@fehub/ui'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useKnowledgeBase } from '../providers/KnowledgeBaseProvider'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface InterviewState {
  isActive: boolean
  currentQuestion: number
  totalQuestions: number
  level: string
  startTime: Date | null
  endTime: Date | null
}

const levelPrompts = {
  junior: `Bạn là một interviewer chuyên nghiệp đang phỏng vấn một Junior Developer về chủ đề cụ thể.

VAI TRÒ CỦA BẠN:
- Bạn là interviewer, KHÔNG phải người được phỏng vấn
- Bạn đặt câu hỏi và đánh giá câu trả lời của ứng viên
- Bạn LUÔN LUÔN có thể trả lời và đặt câu hỏi tiếp theo

Hãy đặt các câu hỏi phù hợp với trình độ junior, tập trung vào:
- Kiến thức cơ bản về chủ đề đang học
- Hiểu biết thực tế về các khái niệm trong bài học
- Kinh nghiệm áp dụng kiến thức này trong dự án
- Khả năng giải thích và áp dụng

QUAN TRỌNG: 
- Chỉ hỏi về nội dung bài học hiện tại, không hỏi về các chủ đề khác
- LUÔN LUÔN trả lời và đặt câu hỏi tiếp theo
- KHÔNG BAO GIỜ nói "không thể trả lời" hoặc từ chối trả lời
- Hãy tương tác một cách thân thiện, khuyến khích và đưa ra gợi ý khi cần thiết
- Mỗi câu hỏi nên ngắn gọn và dễ hiểu. Sau khi người dùng trả lời, hãy đưa ra phản hồi ngắn gọn và chuyển sang câu hỏi tiếp theo.`,

  middle: `Bạn là một interviewer chuyên nghiệp đang phỏng vấn một Middle Developer về chủ đề cụ thể.

VAI TRÒ CỦA BẠN:
- Bạn là interviewer, KHÔNG phải người được phỏng vấn
- Bạn đặt câu hỏi và đánh giá câu trả lời của ứng viên
- Bạn LUÔN LUÔN có thể trả lời và đặt câu hỏi tiếp theo

Hãy đặt các câu hỏi phù hợp với trình độ middle, tập trung vào:
- Kinh nghiệm thực tế với chủ đề đang học
- Khả năng giải quyết vấn đề liên quan đến bài học
- Hiểu biết sâu về các khái niệm và ứng dụng thực tế
- Kinh nghiệm troubleshooting và debugging liên quan
- Khả năng áp dụng vào các dự án phức tạp

QUAN TRỌNG: 
- Chỉ hỏi về nội dung bài học hiện tại, không hỏi về các chủ đề khác
- LUÔN LUÔN trả lời và đặt câu hỏi tiếp theo
- KHÔNG BAO GIỜ nói "không thể trả lời" hoặc từ chối trả lời
- Hãy tương tác một cách chuyên nghiệp, đưa ra các câu hỏi thử thách nhưng không quá khó
- Sau khi người dùng trả lời, hãy đưa ra phản hồi chi tiết và có thể đặt câu hỏi follow-up nếu cần.`,

  senior: `Bạn là một interviewer chuyên nghiệp đang phỏng vấn một Senior Developer về chủ đề cụ thể.

VAI TRÒ CỦA BẠN:
- Bạn là interviewer, KHÔNG phải người được phỏng vấn
- Bạn đặt câu hỏi và đánh giá câu trả lời của ứng viên
- Bạn LUÔN LUÔN có thể trả lời và đặt câu hỏi tiếp theo

Hãy đặt các câu hỏi phù hợp với trình độ senior, tập trung vào:
- Kiến trúc và thiết kế hệ thống liên quan đến chủ đề
- Leadership và mentoring về kiến thức này
- Technical decision making trong các dự án thực tế
- Performance optimization và best practices
- Security và scalability considerations
- Khả năng đánh giá và cải thiện implementation

QUAN TRỌNG: 
- Chỉ hỏi về nội dung bài học hiện tại, không hỏi về các chủ đề khác
- LUÔN LUÔN trả lời và đặt câu hỏi tiếp theo
- KHÔNG BAO GIỜ nói "không thể trả lời" hoặc từ chối trả lời
- Hãy tương tác một cách chuyên nghiệp và nghiêm túc. Đưa ra các câu hỏi thử thách cao,
có thể đặt nhiều câu hỏi follow-up để đánh giá sâu hơn. Sau khi người dùng trả lời,
hãy đưa ra phản hồi chi tiết và có thể thảo luận về các trade-offs.`
}

export const MockInterviewAIPage = () => {
  const { lessonId = '', level = 'junior' } = useParams<{ lessonId: string; level: string }>()
  const navigate = useNavigate()
  const { getLesson } = useKnowledgeBase()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [interviewState, setInterviewState] = useState<InterviewState>({
    isActive: false,
    currentQuestion: 0,
    totalQuestions: level === 'junior' ? 6 : level === 'middle' ? 8 : 10,
    level,
    startTime: null,
    endTime: null
  })
  const [currentAPI, setCurrentAPI] = useState<string>('')
  const [isScoring, setIsScoring] = useState(false)
  const [scoringResult, setScoringResult] = useState<{
    score: number
    feedback: string
    recommendations: string
    passed: boolean
  } | null>(null)

  const lesson = useMemo(() => (lessonId ? getLesson(lessonId) : undefined), [getLesson, lessonId])

  // Function để gọi Groq API (miễn phí)
  const callGroqAPI = async (messages: Array<{ role: string, content: string }>, systemPrompt: string) => {
    const apiKey = (import.meta as any).env?.VITE_GROQ_API_KEY
    if (!apiKey) {
      throw new Error('Groq API key not found. Please set VITE_GROQ_API_KEY in your environment variables.')
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Model mới được hỗ trợ
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.'
  }

  // Function để gọi Hugging Face API (miễn phí)
  const callHuggingFaceAPI = async (messages: Array<{ role: string, content: string }>, systemPrompt: string) => {
    const apiKey = (import.meta as any).env?.VITE_HUGGINGFACE_API_KEY
    if (!apiKey) {
      throw new Error('Hugging Face API key not found. Please set VITE_HUGGINGFACE_API_KEY in your environment variables.')
    }

    // Tạo prompt từ messages
    const conversation = messages.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')
    const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversation}`

    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()
    return data[0]?.generated_text || 'Cảm ơn bạn đã trả lời. Hãy tiếp tục với câu hỏi tiếp theo.'
  }

  // Function để extract JSON từ AI response
  const extractJSON = (response: string) => {
    // Tìm JSON object trong response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return jsonMatch[0]
    }

    // Nếu không tìm thấy, thử tìm JSON array
    const arrayMatch = response.match(/\[[\s\S]*\]/)
    if (arrayMatch) {
      return arrayMatch[0]
    }

    return null
  }

  // Function để validate và cải thiện AI response
  const validateAIResponse = (response: string) => {
    // Kiểm tra các từ khóa không mong muốn
    const unwantedPhrases = [
      'không thể trả lời',
      'không thể giúp',
      'không biết',
      'không hiểu',
      'xin lỗi, tôi không thể',
      'tôi không thể trả lời',
      'không thể hỗ trợ'
    ]

    const hasUnwantedPhrase = unwantedPhrases.some(phrase =>
      response.toLowerCase().includes(phrase.toLowerCase())
    )

    if (hasUnwantedPhrase) {
      console.warn('AI response contains unwanted phrase, using fallback')
      return getFallbackResponse([], '')
    }

    return response
  }

  // Function chính để gọi AI API với fallback
  const callAI = async (messages: Array<{ role: string, content: string }>, systemPrompt: string) => {
    try {
      // Thử Groq API trước (nhanh nhất)
      setCurrentAPI('Groq')
      const response = await callGroqAPI(messages, systemPrompt)
      return validateAIResponse(response)
    } catch (groqError) {
      console.warn('Groq API failed, trying Hugging Face:', groqError)
      try {
        // Fallback sang Hugging Face
        setCurrentAPI('Hugging Face')
        const response = await callHuggingFaceAPI(messages, systemPrompt)
        return validateAIResponse(response)
      } catch (hfError) {
        console.warn('Hugging Face API failed:', hfError)
        // Fallback cuối cùng - trả về câu trả lời mẫu
        setCurrentAPI('Fallback')
        return getFallbackResponse(messages, systemPrompt)
      }
    }
  }

  // Function trả về câu trả lời mẫu khi không có API
  const getFallbackResponse = (messages: Array<{ role: string, content: string }>, systemPrompt: string) => {
    const lastMessage = messages[messages.length - 1]
    const promptTopicMatch = systemPrompt.match(/"([^"]+)"/)
    const fallbackTopic =
      lesson?.title || promptTopicMatch?.[1] || (systemPrompt.trim() ? systemPrompt : 'Frontend Development')

    if (!lastMessage) {
      return `Xin chào! Tôi sẽ là interviewer của bạn hôm nay về ${fallbackTopic}.`
    }

    const responses = [
      `Cảm ơn bạn đã trả lời về ${fallbackTopic}. Hãy cho tôi biết thêm về kinh nghiệm của bạn với ${fallbackTopic}.`,
      `Đó là một câu trả lời tốt về ${fallbackTopic}. Bạn có thể giải thích chi tiết hơn không?`,
      `Tôi hiểu. Câu hỏi tiếp theo: Bạn đã từng gặp phải thử thách nào khi làm việc với ${fallbackTopic}?`,
      `Thú vị! Bạn đã học được gì từ trải nghiệm với ${fallbackTopic}?`,
      `Tuyệt vời! Bạn có câu hỏi nào về ${fallbackTopic} không?`
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Chỉ scroll khi có messages và đang trong trạng thái phỏng vấn
    if (messages.length > 1 && interviewState.isActive) {
      scrollToBottom()
    }
  }, [messages, interviewState.isActive])

  const startInterview = async () => {
    setIsLoading(true)
    setInterviewState(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date()
    }))

    try {
      const systemPrompt = levelPrompts[level as keyof typeof levelPrompts] || levelPrompts.junior
      const fullSystemPrompt = `${systemPrompt}\n\nCHỦ ĐỀ PHỎNG VẤN: "${lesson?.title || 'Frontend Development'}"\n\nHãy bắt đầu cuộc phỏng vấn bằng cách chào hỏi và giới thiệu về chủ đề "${lesson?.title || 'Frontend Development'}". Sau đó đặt câu hỏi đầu tiên về chủ đề này.\n\nQUAN TRỌNG: Chỉ hỏi về nội dung liên quan đến "${lesson?.title || 'Frontend Development'}", không hỏi về các chủ đề khác như kinh nghiệm chung, dự án khác, hoặc kiến thức ngoài phạm vi bài học.`

      console.log('Starting interview with prompt:', fullSystemPrompt)

      const aiMessage = await callAI([], fullSystemPrompt)

      console.log('AI Response:', aiMessage)

      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error starting interview:', error)

      // Fallback message nếu API lỗi
      const fallbackMessage = `Xin chào! Tôi sẽ là interviewer của bạn hôm nay. Chúng ta sẽ thảo luận về ${lesson?.title || 'Frontend Development'}. 

Hãy bắt đầu với câu hỏi đầu tiên: Bạn có thể giải thích về ${lesson?.title || 'Frontend Development'} và kinh nghiệm của bạn với chủ đề này không?`

      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: fallbackMessage,
        timestamp: new Date()
      }])

      console.log('Using fallback message due to API error')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    // Tạo messages mới bao gồm user message vừa gửi
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputMessage('')
    setIsLoading(true)

    try {
      const systemPrompt = levelPrompts[level as keyof typeof levelPrompts] || levelPrompts.junior
      const fullSystemPrompt = `${systemPrompt}\n\nCHỦ ĐỀ PHỎNG VẤN: "${lesson?.title || 'Frontend Development'}"\n\nSau khi người dùng trả lời, hãy đưa ra phản hồi ngắn gọn và chuyển sang câu hỏi tiếp theo về chủ đề "${lesson?.title || 'Frontend Development'}". Hãy tiếp tục cuộc phỏng vấn một cách tự nhiên và đánh giá kiến thức của người dùng về chủ đề này.\n\nQUAN TRỌNG: Chỉ hỏi về nội dung liên quan đến "${lesson?.title || 'Frontend Development'}", không hỏi về các chủ đề khác như kinh nghiệm chung, dự án khác, hoặc kiến thức ngoài phạm vi bài học.`

      // Chỉ lấy user messages để gửi cho AI (bao gồm cả message vừa gửi)
      const messageHistory = updatedMessages
        .filter(msg => msg.role === 'user')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))

      console.log('Sending message with user history only:', messageHistory)
      console.log('Total messages in updated state:', updatedMessages.length)
      console.log('User messages count:', messageHistory.length)

      const aiMessage = await callAI(messageHistory, fullSystemPrompt)

      console.log('AI Response to user message:', aiMessage)

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error sending message:', error)

      // Fallback response
      const fallbackResponses = [
        `Cảm ơn bạn đã trả lời về ${lesson?.title || 'chủ đề này'}. Hãy cho tôi biết thêm về kinh nghiệm của bạn với ${lesson?.title || 'chủ đề này'}.`,
        `Đó là một câu trả lời tốt về ${lesson?.title || 'chủ đề này'}. Bạn có thể giải thích chi tiết hơn không?`,
        `Tôi hiểu. Câu hỏi tiếp theo: Bạn đã từng gặp phải thử thách nào khi làm việc với ${lesson?.title || 'chủ đề này'}?`,
        `Thú vị! Bạn đã học được gì từ trải nghiệm với ${lesson?.title || 'chủ đề này'}?`,
        `Tuyệt vời! Bạn có câu hỏi nào về ${lesson?.title || 'chủ đề này'} không?`
      ]

      const fallbackMessage = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackMessage,
        timestamp: new Date()
      }])

      console.log('Using fallback response due to API error')
    } finally {
      setIsLoading(false)
    }
  }

  const endInterview = () => {
    setInterviewState(prev => ({
      ...prev,
      isActive: false,
      endTime: new Date()
    }))
  }

  // Function để chấm điểm buổi phỏng vấn
  const scoreInterview = async () => {
    if (!messages.length || isLoading || isScoring) return

    setIsScoring(true)

    try {
      const scoringPrompt = `Bạn là một chuyên gia đánh giá phỏng vấn kỹ thuật. Hãy chấm điểm buổi phỏng vấn này theo thang điểm 10 (phản ứng đúng tình trạng, và khắc khe) và đưa ra đánh giá chi tiết.

THÔNG TIN PHỎNG VẤN:
- Chủ đề: "${lesson?.title || 'Frontend Development'}"
- Cấp độ: ${level.charAt(0).toUpperCase() + level.slice(1)}
- Trạng thái: ${interviewState.isActive ? 'Đang diễn ra' : 'Đã kết thúc'}
- Số tin nhắn trao đổi: ${messages.length}

CUỘC HỘI THOẠI:
${messages.map(msg => `${msg.role === 'user' ? 'Ứng viên' : 'Interviewer'}: ${msg.content}`).join('\n')}

YÊU CẦU ĐÁNH GIÁ:
1. Chấm điểm từ 1-10 dựa trên:
   - Kiến thức về chủ đề (30%)
   - Khả năng giải thích và truyền đạt (25%)
   - Kinh nghiệm thực tế (25%)
   - Tư duy logic và giải quyết vấn đề (20%)

2. Đưa ra nhận xét chi tiết về:
   - Điểm mạnh của ứng viên
   - Điểm cần cải thiện
   - Mức độ hiểu biết về chủ đề

3. Đưa ra lời khuyên cụ thể để cải thiện

4. Đánh giá xem ứng viên có PASS trình độ ${level} không

QUAN TRỌNG: Bạn PHẢI trả lời CHỈ bằng JSON, không có text khác. Đây là định dạng bắt buộc:

{
  "score": 7,
  "feedback": "Ứng viên có kiến thức cơ bản về chủ đề nhưng cần cải thiện khả năng giải thích chi tiết.",
  "recommendations": "Hãy thực hành thêm với các dự án thực tế và học cách giải thích code một cách rõ ràng.",
  "passed": true
}`

      const userMessages = messages
        .filter(msg => msg.role === 'user')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))

      console.log('Scoring interview with prompt:', scoringPrompt)

      const aiResponse = await callAI(userMessages, scoringPrompt)

      console.log('AI Scoring Response:', aiResponse)

      // Parse JSON response với cải thiện
      try {
        console.log('Raw AI Response:', aiResponse)

        const jsonString = extractJSON(aiResponse)
        if (!jsonString) {
          throw new Error('No JSON found in response')
        }

        console.log('Extracted JSON:', jsonString)

        const result = JSON.parse(jsonString)
        console.log('Parsed Scoring result:', result)

        // Validate result
        if (typeof result.score !== 'number' || result.score < 1 || result.score > 10) {
          throw new Error('Invalid score')
        }

        setScoringResult({
          score: result.score,
          feedback: result.feedback || 'Không thể đánh giá',
          recommendations: result.recommendations || 'Không có khuyến nghị',
          passed: Boolean(result.passed)
        })
      } catch (parseError) {
        console.error('Error parsing scoring result:', parseError)
        console.log('AI Response that failed to parse:', aiResponse)

        // Fallback nếu không parse được JSON
        setScoringResult({
          score: 5,
          feedback: 'Có lỗi khi phân tích kết quả phỏng vấn. AI không trả về định dạng JSON hợp lệ.',
          recommendations: 'Hãy thử lại sau hoặc liên hệ hỗ trợ kỹ thuật.',
          passed: false
        })
      }

    } catch (error) {
      console.error('Error scoring interview:', error)

      // Fallback response
      setScoringResult({
        score: 5,
        feedback: 'Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.',
        recommendations: 'Hãy đảm bảo kết nối internet ổn định và thử lại.',
        passed: false
      })
    } finally {
      setIsScoring(false)
    }
  }

  if (!lesson) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#eef2ff] text-slate-900 dark:bg-background dark:text-foreground">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-[-12rem] h-[26rem] w-[26rem] rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-600/20" />
          <div className="absolute -right-24 bottom-[-10rem] h-[28rem] w-[28rem] rounded-full bg-sky-200/45 blur-3xl dark:bg-sky-500/25" />
        </div>
        <div className="relative flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Không tìm thấy bài học</h1>
            <Button asChild className="mt-4">
              <Link to="/knowledge-base">Quay lại Knowledge Base</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#eef2ff] text-slate-900 dark:bg-background dark:text-foreground">
      <div className="relative h-screen flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 sm:px-10 xl:px-16 border-b border-indigo-200/70 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 min-h-[80px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link to={`/knowledge-base/${lessonId}/mock-interview`}>← Chọn cấp độ</Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lesson.title} - {level.charAt(0).toUpperCase() + level.slice(1)} Level
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {interviewState.isActive ? 'Đang phỏng vấn' : 'Chưa bắt đầu'}
                </p>
                {currentAPI && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${currentAPI === 'Groq' ? 'bg-green-500' :
                      currentAPI === 'Hugging Face' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      AI: {currentAPI}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {interviewState.isActive && (
              <div className="flex gap-2">
                <Button
                  onClick={scoreInterview}
                  disabled={isScoring || !messages.length}
                  variant="outline"
                  size="sm"
                >
                  {isScoring ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                      Đang chấm điểm...
                    </div>
                  ) : (
                    'Chấm điểm buổi phỏng vấn'
                  )}
                </Button>
                <Button
                  onClick={endInterview}
                  variant="destructive"
                  size="sm"
                >
                  Kết thúc phỏng vấn
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-hidden">
            {!interviewState.isActive ? (
              <div className="h-full flex items-center justify-center px-6 py-4 sm:px-10 xl:px-16 animate-fadeIn">
                <div className="text-center max-w-lg mx-auto">
                  <div className="mb-12">
                    <div className="bg-indigo-500 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg animate-fadeIn-delay-1">
                      <span className="text-4xl">🤖</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 animate-fadeIn-delay-2">
                      Sẵn sàng bắt đầu phỏng vấn?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed animate-fadeIn-delay-3">
                      AI sẽ đóng vai trò interviewer và tương tác với bạn như một cuộc phỏng vấn thực tế.
                      <br />
                      Hãy chuẩn bị tinh thần và bắt đầu khi bạn sẵn sàng!
                    </p>
                  </div>

                  <Button
                    onClick={startInterview}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-300 disabled:opacity-50 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 animate-fadeIn-delay-4"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Đang khởi tạo...
                      </div>
                    ) : (
                      'Bắt đầu phỏng vấn'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="chat-container animate-slideUp flex flex-col h-full">
                {/* Messages */}
                <div className="chat-messages flex-1 px-3 py-4 sm:px-6 md:px-10 xl:px-16 overflow-y-auto">
                  <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 pb-4">
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${message.role === 'user'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/90 text-slate-900 shadow-lg dark:bg-slate-800 dark:text-white'
                            }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                            {message.timestamp.toLocaleTimeString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start animate-fadeIn">
                        <div className="bg-white/90 text-slate-900 shadow-lg dark:bg-slate-800 dark:text-white rounded-2xl px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                            <span className="text-sm">AI đang suy nghĩ...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area */}
                <div className="chat-input px-3 py-4 sm:px-6 md:px-10 xl:px-16 border-t border-indigo-200/70 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70 backdrop-blur-sm animate-slideUp flex-shrink-0">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Nhập câu trả lời của bạn..."
                        className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-indigo-200/70 bg-white/90 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 transition-all duration-300 ease-out hover:shadow-md focus:shadow-lg focus:scale-[1.01] animate-fadeIn delay-[300ms] text-sm sm:text-base"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-fadeIn delay-[500ms] text-sm sm:text-base"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span className="text-sm">Đang gửi...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>Gửi</span>
                            <svg
                              className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scoring Result Modal */}
      {scoringResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Kết quả chấm điểm
              </h3>
              <Button
                onClick={() => setScoringResult(null)}
                variant="outline"
                size="sm"
              >
                ✕
              </Button>
            </div>

            {/* Score Display */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold ${scoringResult.score >= 8 ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                  scoringResult.score >= 6 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                }`}>
                {scoringResult.score}/10
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white mt-2">
                {scoringResult.passed ? '✅ PASS' : '❌ CHƯA PASS'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Trình độ {level.charAt(0).toUpperCase() + level.slice(1)}
              </p>
            </div>

            {/* Feedback */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  📝 Nhận xét
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {scoringResult.feedback}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  💡 Lời khuyên
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {scoringResult.recommendations}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setScoringResult(null)}
                className="flex-1"
              >
                Đóng
              </Button>
              <Button
                onClick={() => {
                  setScoringResult(null)
                  navigate(`/knowledge-base/${lessonId}`)
                }}
                variant="outline"
                className="flex-1"
              >
                Quay lại bài học
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
