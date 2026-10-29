// reportProfileApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface ReportedProfileRef {
  _id: string
  matrimonyId?: string
  profilePhoto?: string
  isBlocked?: boolean
  basicDetails?: {
    firstName?: string
    lastName?: string
  }
}

export interface AdminRef {
  _id: string
  name?: string
  email?: string
}

export type ReportStatus = 'pending' | 'resolved' | 'rejected'
export type AdminAction = 'none' | 'blocked' | 'dismissed'

export interface ProfileReport {
  _id: string
  reporterId: ReportedProfileRef
  reportedProfileId: ReportedProfileRef
  reason: string
  status: ReportStatus
  adminAction: AdminAction
  adminId?: AdminRef | null
  adminNote?: string | null
  resolvedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface ProfileReportListResponse {
  success: boolean
  message?: string
  data: ProfileReport[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ProfileReportResponse {
  success: boolean
  message?: string
  data: ProfileReport
}

export interface GetReportsParams {
  status?: ReportStatus
  page?: number
  limit?: number
}

export interface AdminActionPayload {
  adminNote?: string
}

// ---------- Base URL ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const reportProfileApi = createApi({
  reducerPath: 'reportProfileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['ProfileReport'],
  endpoints: (builder) => ({
    getProfileReports: builder.query<ProfileReportListResponse, GetReportsParams | void>({
      query: (params) => ({
        url: '/profile-report',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['ProfileReport'],
    }),

    getProfileReportById: builder.query<ProfileReportResponse, string>({
      query: (reportId) => ({
        url: `/profile-report/${reportId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, reportId) => [{ type: 'ProfileReport', id: reportId }],
    }),

    blockReportedProfile: builder.mutation<{ success: boolean; message?: string }, { reportId: string; body?: AdminActionPayload }>({
      query: ({ reportId, body }) => ({
        url: `/profile-report/block/${reportId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { reportId }) => [{ type: 'ProfileReport', id: reportId }, 'ProfileReport'],
    }),

    dismissProfileReport: builder.mutation<{ success: boolean; message?: string }, { reportId: string; body?: AdminActionPayload }>({
      query: ({ reportId, body }) => ({
        url: `/profile-report/dismiss/${reportId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { reportId }) => [{ type: 'ProfileReport', id: reportId }, 'ProfileReport'],
    }),

    unblockProfile: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (profileId) => ({
        url: `/profile-report/unblock/${profileId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['ProfileReport'],
    }),
    getBlockedProfiles: builder.query<ProfileReportListResponse, void>({
      query: () => ({ url: '/profile-report/blocked', method: 'GET' }),
      providesTags: ['ProfileReport'],
    }),
  }),
})

export const {
  useGetProfileReportsQuery,
  useGetProfileReportByIdQuery,
  useBlockReportedProfileMutation,
  useDismissProfileReportMutation,
  useUnblockProfileMutation,
  useGetBlockedProfilesQuery,
} = reportProfileApi
