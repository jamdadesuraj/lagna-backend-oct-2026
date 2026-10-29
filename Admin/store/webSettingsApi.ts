// webSettingsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export interface WebSettings {
  _id: string
  websiteName: string
  websiteUrl?: string
  tagline?: string

  mobileNo?: string
  whatsappNo?: string
  supportEmail?: string
  businessEmail?: string
  address?: string
  supportHours?: string

  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string

  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
  twitterUrl?: string

  copyrightText?: string
  footerDescription?: string

  maintenanceMode: boolean

  logo?: string
  favicon?: string

  createdAt: string
  updatedAt: string
  __v?: number
}

export interface WebSettingsResponse {
  success: boolean
  message?: string
  data: WebSettings
}

// logo/favicon are optional here — only sent when the user picks a new file
export interface UpdateWebSettingsRequest {
  websiteName: string
  websiteUrl?: string
  tagline?: string

  mobileNo?: string
  whatsappNo?: string
  supportEmail?: string
  businessEmail?: string
  address?: string
  supportHours?: string

  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string

  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
  twitterUrl?: string

  copyrightText?: string
  footerDescription?: string

  maintenanceMode?: boolean

  logo?: File
  favicon?: File
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- Helper: build multipart FormData from the typed request ----------
const toFormData = (body: UpdateWebSettingsRequest): FormData => {
  const formData = new FormData()

  Object.entries(body).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (typeof value === 'boolean') {
      formData.append(key, value ? 'true' : 'false')
      return
    }

    formData.append(key, value as string | Blob)
  })

  return formData
}

// ---------- API slice ----------
export const webSettingsApi = createApi({
  reducerPath: 'webSettingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['WebSettings'],
  endpoints: (builder) => ({
    getWebSettings: builder.query<WebSettingsResponse, void>({
      query: () => ({
        url: '/admin/web-settings',
        method: 'GET',
      }),
      providesTags: ['WebSettings'],
    }),

    updateWebSettings: builder.mutation<WebSettingsResponse, UpdateWebSettingsRequest>({
      query: (body) => ({
        url: '/admin/web-settings',
        method: 'PUT',
        body: toFormData(body),
      }),
      invalidatesTags: ['WebSettings'],
    }),
  }),
})

export const { useGetWebSettingsQuery, useUpdateWebSettingsMutation } = webSettingsApi
