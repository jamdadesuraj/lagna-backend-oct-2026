'use client'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import { store } from '../../../store/store'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DEFAULT_PAGE_TITLE } from '@/context/constants'
import { ChildrenType } from '@/types/component-props'
import dynamic from 'next/dynamic'
const LayoutProvider = dynamic(() => import('@/context/useLayoutContext').then((mod) => mod.LayoutProvider), {
  ssr: false,
})
import { NotificationProvider } from '@/context/useNotificationContext'
import { TitleProvider } from '@/context/useTitleContext'

const AppProvidersWrapper = ({ children }: ChildrenType) => {
  const handleChangeTitle = () => {
    if (document.visibilityState == 'hidden') document.title = 'Please come back 🥺'
    else document.title = DEFAULT_PAGE_TITLE
  }

  useEffect(() => {
    if (document) {
      const e = document.querySelector<HTMLDivElement>('#__next_splash')
      if (e?.hasChildNodes()) {
        document.querySelector('#splash-screen')?.classList.add('remove')
      }
      e?.addEventListener('DOMNodeInserted', () => {
        document.querySelector('#splash-screen')?.classList.add('remove')
      })
    }

    document.addEventListener('visibilitychange', handleChangeTitle)
    return () => {
      document.removeEventListener('visibilitychange', handleChangeTitle)
    }
  }, [])

  return (
    <Provider store={store}>
      <SessionProvider>
        <LayoutProvider>
          <TitleProvider>
            <NotificationProvider>
              {children}
              <ToastContainer theme="colored" position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnHover />
            </NotificationProvider>
          </TitleProvider>
        </LayoutProvider>
      </SessionProvider>
    </Provider>
  )
}
export default AppProvidersWrapper
