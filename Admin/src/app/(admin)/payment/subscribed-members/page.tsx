import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import SubscribedMember from './components/SubscribedMember'
import TopCards from './components/TopCards'

export const metadata: Metadata = { title: 'Subscribed Members' }

const SubscribedMemberPage = () => {
  return (
    <>
      <PageTItle title="Subscribed Members" />
      <TopCards />
      <SubscribedMember />
    </>
  )
}

export default SubscribedMemberPage
