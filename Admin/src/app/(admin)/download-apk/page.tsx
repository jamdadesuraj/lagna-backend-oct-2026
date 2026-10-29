import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import DownloadApk from './components/DownloadApk'

export const metadata: Metadata = { title: 'Download Apk' }

const DownloadApkPage = () => {
  return (
    <>
      <PageTItle title="Download Apk" />
      <DownloadApk />
    </>
  )
}

export default DownloadApkPage
