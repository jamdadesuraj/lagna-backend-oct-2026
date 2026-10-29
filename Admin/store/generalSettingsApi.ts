// generalSettingsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export interface CurrentAdmin {
  _id: string
  email?: string
  mobile: string
  role: string
}

export interface CurrentAdminResponse {
  success: boolean
  data: CurrentAdmin
}

export interface UpdateAdminCredentialsRequest {
  username: string
  password: string
  confirmPassword: string
}

export interface UpdateAdminCredentialsResponse {
  success: boolean
  message: string
  data: {
    id: string
    email: string
    role: string
  }
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const generalSettingsApi = createApi({
  reducerPath: 'generalSettingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CurrentAdmin'],
  endpoints: (builder) => ({
    getCurrentAdmin: builder.query<CurrentAdminResponse, void>({
      query: () => ({
        url: '/admin/auth/me',
        method: 'GET',
      }),
      providesTags: ['CurrentAdmin'],
    }),

    updateAdminCredentials: builder.mutation<UpdateAdminCredentialsResponse, UpdateAdminCredentialsRequest>({
      query: (body) => ({
        url: '/admin/auth/update-credentials',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CurrentAdmin'],
    }),
  }),
})

export const { useGetCurrentAdminQuery, useUpdateAdminCredentialsMutation } = generalSettingsApi
