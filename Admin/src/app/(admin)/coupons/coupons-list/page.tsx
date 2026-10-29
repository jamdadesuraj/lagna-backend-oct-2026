import React from 'react'
import CouponsBoxs from './components/CouponsBoxs'
import CouponsDataList from './components/CouponsDataList'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Coupons List' }

const CouponsListPage = () => {
  return (
    <>
      <PageTItle title="COUPONS" />
      <CouponsBoxs />
      <CouponsDataList />
    </>
  )
}

export default CouponsListPage
