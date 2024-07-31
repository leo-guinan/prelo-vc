'use client'

import * as React from 'react'
import { useInView } from 'react-intersection-observer'

import { useAtBottom } from '@/lib/hooks/use-at-bottom'

interface ChatScrollAnchorProps {
  trackVisibility?: boolean
}

export function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps) {
  const isAtBottom = useAtBottom()
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: '0px 0px -500px 0px'
  })

  React.useEffect(() => {
    console.log("Checking if at bottom", isAtBottom, trackVisibility, inView)
    if (isAtBottom && trackVisibility && !inView) {
      console.log("Scrolling")
      entry?.target.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  }, [inView, entry, isAtBottom, trackVisibility])

  return <div ref={ref} className="h-px w-full" />
}
