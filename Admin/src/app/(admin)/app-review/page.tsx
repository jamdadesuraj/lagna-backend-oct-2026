import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AppReview from './components/AppReview'

export const metadata: Metadata = { title: 'App Review' }

const AppReviewPage = () => {
  return (
    <>
      <PageTItle title="App Review" />
      <AppReview />
    </>
  )
}

export default AppReviewPage
