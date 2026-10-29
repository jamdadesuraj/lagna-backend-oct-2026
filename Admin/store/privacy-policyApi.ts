import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface PrivacyPolicy {
  _id: string
  title: string
  content: string
  updatedAt: string
}

export interface PrivacyPolicyResponse {
  success: boolean
  message?: string
  data: PrivacyPolicy
}

// Backend requires BOTH title and content
export interface SavePrivacyPolicyRequest {
  title: string
  content: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
if (!API_BASE_URL) throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')

export const privacyPolicyApi = createApi({
  reducerPath: 'privacyPolicyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['PrivacyPolicy'],
  endpoints: (builder) => ({
    createOrUpdatePrivacyPolicy: builder.mutation<PrivacyPolicyResponse, SavePrivacyPolicyRequest>({
      query: (body) => ({ url: '/admin/privacy-policy', method: 'POST', body }),
      invalidatesTags: ['PrivacyPolicy'],
    }),
    getPrivacyPolicy: builder.query<PrivacyPolicyResponse, void>({
      query: () => ({ url: '/admin/privacy-policy', method: 'GET' }),
      providesTags: ['PrivacyPolicy'],
    }),
  }),
})

export const { useCreateOrUpdatePrivacyPolicyMutation, useGetPrivacyPolicyQuery } = privacyPolicyApi
