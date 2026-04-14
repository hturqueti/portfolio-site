'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const SCROLL_RESET_KEY = 'portfolio:scroll-top-on-navigation'

export function markScrollTopOnNavigation() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(SCROLL_RESET_KEY, '1')
}

export function ScrollTopOnNavigation() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.sessionStorage.getItem(SCROLL_RESET_KEY) !== '1') {
      return
    }

    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior

    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    window.sessionStorage.removeItem(SCROLL_RESET_KEY)

    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior
    })
  }, [pathname])

  return null
}
