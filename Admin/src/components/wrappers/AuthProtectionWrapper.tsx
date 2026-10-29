'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import type { ChildrenType } from '@/types/component-props'
import FallbackLoading from '../FallbackLoading'

const AuthProtectionWrapper = ({ children }: ChildrenType) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      push(`/auth/sign-in?redirectTo=${pathname}`)
    } else {
      setChecked(true)
    }
  }, [pathname, push])

  if (!checked) return <FallbackLoading />

  return <Suspense>{children}</Suspense>
}

export default AuthProtectionWrapper
