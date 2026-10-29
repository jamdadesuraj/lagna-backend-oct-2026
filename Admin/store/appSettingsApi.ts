// appSettingsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export interface AppSettings {
  _id: string
  appName: string
  mobileNo?: string
  whatsappNo?: string
  supportEmail?: string
  businessEmail?: string
  websiteUrl?: string
  address?: string
  googlePlayUrl?: string
  appStoreUrl?: string
  supportHours?: string
  copyrightText?: string
  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
  appLogo?: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface AppSettingsResponse {
  success: boolean
  message?: string
  data: AppSettings
}

// appLogo is optional here since it's only sent when the user picks a new file
export interface UpdateAppSettingsRequest {
  appName: string
  mobileNo?: string
  whatsappNo?: string
  supportEmail?: string
  businessEmail?: string
  websiteUrl?: string
  address?: string
  googlePlayUrl?: string
  appStoreUrl?: string
  supportHours?: string
  copyrightText?: string
  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
  appLogo?: File
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- Helper: build multipart FormData from the typed request ----------
const toFormData = (body: UpdateAppSettingsRequest): FormData => {
  const formData = new FormData()

  Object.entries(body).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    formData.append(key, value as string | Blob)
  })

  return formData
}

// ---------- API slice ----------
export const appSettingsApi = createApi({
  reducerPath: 'appSettingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AppSettings'],
  endpoints: (builder) => ({
    getAppSettings: builder.query<AppSettingsResponse, void>({
      query: () => ({
        url: '/admin/app-settings',
        method: 'GET',
      }),
      providesTags: ['AppSettings'],
    }),

    updateAppSettings: builder.mutation<AppSettingsResponse, UpdateAppSettingsRequest>({
      query: (body) => ({
        url: '/admin/app-settings',
        method: 'PUT',
        body: toFormData(body),
      }),
      invalidatesTags: ['AppSettings'],
    }),
  }),
})

export const { useGetAppSettingsQuery, useUpdateAppSettingsMutation } = appSettingsApi
