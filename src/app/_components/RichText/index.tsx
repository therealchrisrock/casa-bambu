import React from 'react'

import serialize from './serialize'

import classes from './index.module.scss'

const RichText: React.FC<{ className?: string; content: any, size?: 'prose' | 'prose-lg' | '' }> = ({ className, content, size = 'prose' }) => {
  if (!content) {
    return null
  }

  return (
    <div className={[classes.richText, size, className].filter(Boolean).join(' ')}>
      {serialize(content)}
    </div>
  )
}

export default RichText
