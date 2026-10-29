import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Careers from './components/Careers'

export const metadata: Metadata = { title: 'Careers' }

const CareersPage = () => {
  return (
    <>
      <PageTItle title="Careers" />
      <Careers />
    </>
  )
}

export default CareersPage
