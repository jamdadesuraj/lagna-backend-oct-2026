import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Blog from './components/Blog'

export const metadata: Metadata = { title: 'Blog' }

const BlogPage = () => {
  return (
    <>
      <PageTItle title="Blog" />
      <Blog />
    </>
  )
}

export default BlogPage
