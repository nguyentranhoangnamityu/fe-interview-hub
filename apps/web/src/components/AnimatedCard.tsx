import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  hover?: boolean
}

export const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0,
  hover = true 
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      whileHover={hover ? { 
        scale: 1.01, 
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  )
}
