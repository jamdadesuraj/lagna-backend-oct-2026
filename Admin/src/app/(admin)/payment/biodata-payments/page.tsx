import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'

import TopCards from './components/TopCards'
import BioDataPayments from './components/BioDataPayments'

export const metadata: Metadata = { title: 'Bio Data Payments' }

const BioDataPaymentsPage = () => {
  return (
    <>
      <PageTItle title="Bio Data Payments" />
      <TopCards />
      <BioDataPayments />
    </>
  )
}

export default BioDataPaymentsPage
