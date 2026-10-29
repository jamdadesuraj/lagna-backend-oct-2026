// aboutUsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Nested Types ----------
export interface AboutUsStat {
  value: string
  label: string
}

export interface AboutUsAward {
  title: string
  subtitle: string
  year: string
}

export interface AboutUsStep {
  title: string
  description: string
}

// ---------- Main Type ----------
export interface AboutUs {
  _id: string

  // Hero
  heroBadge: string
  heroTitle: string
  heroHighlightedTitle: string
  heroDescription: string
  heroBadgeText: string
  heroImage: string

  // CEO
  ceoSectionTitle: string
  ceoName: string
  ceoDesignation: string
  ceoLetter: string
  ceoImage: string

  // Mission & Vision
  missionVisionTitle: string
  missionTitle: string
  missionDescription: string
  visionTitle: string
  visionDescription: string

  // About
  aboutSectionTitle: string
  aboutDescription: string
  aboutImage: string
  stats: AboutUsStat[]

  // Awards
  awardSectionTitle: string
  awards: AboutUsAward[]

  // How To Use
  howToTitle: string
  steps: AboutUsStep[]

  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface AboutUsResponse {
  success: boolean
  message?: string
  data: AboutUs
}

// ---------- Base URL ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const aboutUsApi = createApi({
  reducerPath: 'aboutUsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AboutUs'],
  endpoints: (builder) => ({
    getAboutUs: builder.query<AboutUsResponse, void>({
      query: () => ({
        url: '/admin/manage-about-us',
        method: 'GET',
      }),
      providesTags: ['AboutUs'],
    }),

    saveAboutUs: builder.mutation<AboutUsResponse, FormData>({
      query: (formData) => ({
        url: '/admin/manage-about-us',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['AboutUs'],
    }),
  }),
})

export const { useGetAboutUsQuery, useSaveAboutUsMutation } = aboutUsApi
