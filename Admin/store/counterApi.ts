// counterApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface Counter {
  _id: string
  mobileVerifiedProfiles: string
  customersServed: string
  successfulMatchmakingYears: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface CounterResponse {
  success: boolean
  message?: string
  data: Counter
}

export interface CreateOrUpdateCounterRequest {
  mobileVerifiedProfiles: string
  customersServed: string
  successfulMatchmakingYears: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const counterApi = createApi({
  reducerPath: 'counterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Counter'],
  endpoints: (builder) => ({
    createOrUpdateCounter: builder.mutation<CounterResponse, CreateOrUpdateCounterRequest>({
      query: (body) => ({
        url: '/admin/counter',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Counter'],
    }),

    getCounter: builder.query<CounterResponse, void>({
      query: () => ({
        url: '/admin/counter',
        method: 'GET',
      }),
      providesTags: ['Counter'],
    }),
  }),
})

export const { useCreateOrUpdateCounterMutation, useGetCounterQuery } = counterApi
