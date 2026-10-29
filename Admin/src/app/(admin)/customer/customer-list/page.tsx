import React from 'react'
import CustomerDataCard from './components/CustomerDataCard'
import CustomerDataList from './components/CustomerDataList'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customer' }

const CustomerPage = () => {
  return (
    <>
      <PageTItle title="CUSTOMER LIST" />
      <CustomerDataCard />
      <CustomerDataList />
    </>
  )
}

export default CustomerPage
