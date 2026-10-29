import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import OnlinePersonalTips from './components/OnlinePersonalTips'

export const metadata: Metadata = { title: 'Online Personal Tips' }

const OnlinePersonalTipsPage = () => {
  return (
    <>
      <PageTItle title="Online Personal Tips" />
      <OnlinePersonalTips />
    </>
  )
}

export default OnlinePersonalTipsPage
