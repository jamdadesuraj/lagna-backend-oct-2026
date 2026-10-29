import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Onboarding from './components/Onboarding'

export const metadata: Metadata = { title: 'Onboarding' }

const OnboardingPage = () => {
  return (
    <>
      <PageTItle title="Onboarding" />
      <Onboarding />
    </>
  )
}

export default OnboardingPage
