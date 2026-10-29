// downloadApkApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export interface DownloadApk {
  _id: string
  title: string
  subtitle?: string
  googlePlayUrl?: string
  appStoreUrl?: string
  qrCode?: string
  apkImage?: string
  createdAt: string
  updatedAt: string
}

export interface DownloadApkResponse {
  success: boolean
  message?: string
  data: DownloadApk
}

// ---------- Base URL ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const downloadApkApi = createApi({
  reducerPath: 'downloadApkApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['DownloadApk'],
  endpoints: (builder) => ({
    getDownloadApk: builder.query<DownloadApkResponse, void>({
      query: () => ({
        url: '/admin/download-apk',
        method: 'GET',
      }),
      providesTags: ['DownloadApk'],
    }),

    saveDownloadApk: builder.mutation<DownloadApkResponse, FormData>({
      query: (formData) => ({
        url: '/admin/download-apk',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['DownloadApk'],
    }),
  }),
})

export const { useGetDownloadApkQuery, useSaveDownloadApkMutation } = downloadApkApi
