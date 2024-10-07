'use client'
import { ReactNode, useState } from 'react'
import { ChevronRight } from 'lucide-react'

export function TruncateText({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className={open ? '' : 'line-clamp-6'}>{children}</div>
      <button className={'underline font-medium text-copy inline-flex items-center mt-3'} onClick={() => setOpen(!open)}>
        {open ? (
          'Show Less'
        ) : (
          <>
            Show More <ChevronRight size={'20'} />
          </>
        )}
      </button>
    </div>
  )
}
