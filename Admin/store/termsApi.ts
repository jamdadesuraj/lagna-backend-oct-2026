// termsConditionsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface TermsConditions {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface TermsConditionsResponse {
  success: boolean
  message?: string
  data: TermsConditions
}

export interface CreateOrUpdateTermsConditionsRequest {
  title: string
  content: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const termsConditionsApi = createApi({
  reducerPath: 'termsConditionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['TermsConditions'],
  endpoints: (builder) => ({
    createOrUpdateTermsConditions: builder.mutation<TermsConditionsResponse, CreateOrUpdateTermsConditionsRequest>({
      query: (body) => ({
        url: '/admin/terms-conditions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TermsConditions'],
    }),

    getTermsConditions: builder.query<TermsConditionsResponse, void>({
      query: () => ({
        url: '/admin/terms-conditions',
        method: 'GET',
      }),
      providesTags: ['TermsConditions'],
    }),
  }),
})

export const { useCreateOrUpdateTermsConditionsMutation, useGetTermsConditionsQuery } = termsConditionsApi
