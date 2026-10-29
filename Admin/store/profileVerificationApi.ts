// profileVerificationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface ProfileVerificationRequest {
  _id: string
  profileId: {
    _id: string
    userId?: string
    matrimonyId?: string
    photos?: string[]
    basicDetails?: {
      firstName?: string
      lastName?: string
    }
  }
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string | null
  adhaarFrontUrl?: string
  selfieUrl?: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: {
    _id: string
    role: string
  }
  createdAt: string
  updatedAt: string
}

export interface ProfileVerificationListResponse {
  success: boolean
  count: number
  data: ProfileVerificationRequest[]
}

export interface ProfileVerificationResponse {
  success: boolean
  data: ProfileVerificationRequest
}

export interface ReviewVerificationPayload {
  status: 'approved' | 'rejected'
  rejectionReason?: string
}

// ---------- Base URL ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const profileVerificationApi = createApi({
  reducerPath: 'profileVerificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['ProfileVerification'],
  endpoints: (builder) => ({
    getProfileVerifications: builder.query<ProfileVerificationListResponse, void>({
      query: () => ({
        url: '/profile-verification/admin',
        method: 'GET',
      }),
      providesTags: ['ProfileVerification'],
    }),

    getProfileVerificationById: builder.query<ProfileVerificationResponse, string>({
      query: (id) => ({
        url: `/profile-verification/admin/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'ProfileVerification', id }],
    }),

    reviewProfileVerification: builder.mutation<ProfileVerificationResponse, { id: string; body: ReviewVerificationPayload }>({
      query: ({ id, body }) => ({
        url: `/profile-verification/admin/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'ProfileVerification', id }, 'ProfileVerification'],
    }),

    deleteProfileVerification: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/profile-verification/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProfileVerification'],
    }),
  }),
})

export const {
  useGetProfileVerificationsQuery,
  useGetProfileVerificationByIdQuery,
  useReviewProfileVerificationMutation,
  useDeleteProfileVerificationMutation,
} = profileVerificationApi
