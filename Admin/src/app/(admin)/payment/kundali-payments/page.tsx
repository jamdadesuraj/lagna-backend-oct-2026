import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import TopCards from './components/TopCards'
import KundaliPayments from './components/KundaliPayments'

export const metadata: Metadata = { title: 'Kundali Payments' }

const KundaliPaymentsPage = () => {
  return (
    <>
      <PageTItle title="Kundali Payments" />
      <TopCards />
      <KundaliPayments />
    </>
  )
}

export default KundaliPaymentsPage
