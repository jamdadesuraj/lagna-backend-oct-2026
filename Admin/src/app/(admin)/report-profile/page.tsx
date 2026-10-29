import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ReportProfile from './components/ReportProfile'

export const metadata: Metadata = { title: 'Report Profile' }

const ReportProfilePage = () => {
  return (
    <>
      <PageTItle title="Report Profile" />
      <ReportProfile />
    </>
  )
}

export default ReportProfilePage
