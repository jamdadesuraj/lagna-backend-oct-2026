import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import SuccessStory from './components/SuccessStory'

export const metadata: Metadata = { title: 'Success Stories' }

const SuccessStoryPage = () => {
  return (
    <>
      <PageTItle title="Success Stories" />
      <SuccessStory />
    </>
  )
}

export default SuccessStoryPage
