import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'

import TopCards from './components/TopCards'
import SpotlightPayments from './components/SpotlightPayments'

export const metadata: Metadata = { title: 'Spotlight Payments' }

const SpotlightPaymentsPage = () => {
  return (
    <>
      <PageTItle title="Spotlight Payments" />
      <TopCards />
      <SpotlightPayments />
    </>
  )
}

export default SpotlightPaymentsPage
