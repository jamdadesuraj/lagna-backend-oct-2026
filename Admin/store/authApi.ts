// authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface AdminUser {
  id: string
  email: string
  role: 'ADMIN' | 'SUBADMIN' | string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    admin: AdminUser
    accessToken: string
    refreshToken: string
  }
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- Base query ----------
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

// ---------- Base query with auto-refresh on 401 ----------
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken')

    const refreshResult = await rawBaseQuery({ url: '/admin/auth/refresh-token', method: 'POST', body: { refreshToken } }, api, extraOptions)

    if (refreshResult.data) {
      const { data } = refreshResult.data as RefreshTokenResponse
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      result = await rawBaseQuery(args, api, extraOptions) // retry original request
    } else {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
  }

  return result
}

// ---------- API slice ----------
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem('accessToken', data.data.accessToken)
          localStorage.setItem('refreshToken', data.data.refreshToken)
        } catch {
          // login failed — nothing to persist
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: '/admin/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      },
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApi
