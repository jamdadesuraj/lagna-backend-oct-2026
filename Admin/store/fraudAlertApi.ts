// fraudAlertApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export interface FraudAlert {
  _id: string
  title: string
  content: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface FraudAlertResponse {
  success: boolean
  message?: string
  data: FraudAlert
}

export interface CreateOrUpdateFraudAlertRequest {
  title: string
  content: string
  isActive?: boolean
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const fraudAlertApi = createApi({
  reducerPath: 'fraudAlertApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['FraudAlert'],
  endpoints: (builder) => ({
    createOrUpdateFraudAlert: builder.mutation<FraudAlertResponse, CreateOrUpdateFraudAlertRequest>({
      query: (body) => ({
        url: '/admin/fraud-alert',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FraudAlert'],
    }),

    getFraudAlert: builder.query<FraudAlertResponse, void>({
      query: () => ({
        url: '/admin/fraud-alert',
        method: 'GET',
      }),
      providesTags: ['FraudAlert'],
    }),
  }),
})

export const { useCreateOrUpdateFraudAlertMutation, useGetFraudAlertQuery } = fraudAlertApi
