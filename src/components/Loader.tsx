'use client'

import { useEffect, useState } from 'react'

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true)
      setTimeout(() => setRemoved(true), 500)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  if (removed) return null

  return (
    <div
      className="loader"
      style={{
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
        transition: 'opacity 0.5s ease',
      }}
    >
      <span className="loader-kanji">改</span>
    </div>
  )
}
