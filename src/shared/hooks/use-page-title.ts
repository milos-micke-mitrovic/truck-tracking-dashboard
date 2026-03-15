import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Track Dashboard` : 'Track Dashboard'
  }, [title])
}
