import React from 'react'
import EditForm from './components/EditForm'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Attributes Edit' }

const page = () => {
  return (
    <>
      <PageTItle title="ATTRIBUTE EDIT" />
      <EditForm />
    </>
  )
}

export default page
