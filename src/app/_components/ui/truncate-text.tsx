'use client'
import { ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

export function TruncateText({ children }: { children: ReactNode }) {
  const ref = useRef(null)
  const { isTruncated, isReadingMore, setIsReadingMore } = useTruncatedElement({
    ref,
  })

  return (
    <div>
      <div ref={ref} className={`break-words ${!isReadingMore && 'line-clamp-6'}`}>
        {children}
      </div>
      {isTruncated && (
        <>
          {isReadingMore ? (
            <button
              className={'underline font-medium text-base inline-flex items-center mt-3'}
              onClick={() => setIsReadingMore(false)}
            >
              Show Less
            </button>
          ) : (
            <button
              className={'underline font-medium text-base inline-flex items-center mt-3'}
              onClick={() => setIsReadingMore(true)}
            >
              Show More <ChevronRight size={'20'} />
            </button>
          )}
        </>
      )}
    </div>
  )
}

const useTruncatedElement = ({ ref }) => {
  const [isTruncated, setIsTruncated] = useState(false)
  const [isReadingMore, setIsReadingMore] = useState(false)

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current || {}

    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true)
    } else {
      setIsTruncated(false)
    }
  }, [ref])

  return {
    isTruncated,
    isReadingMore,
    setIsReadingMore,
  }
}
