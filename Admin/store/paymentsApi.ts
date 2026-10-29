// paymentStatsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export interface SubscriptionStats {
  totalSubscribed: number
  todaySubscribed: number
  totalRevenue: number
}

export interface SubscriptionStatsResponse {
  success: boolean
  message?: string
  data: SubscriptionStats
}

export type SubscribedMemberStatus = 'ACTIVE' | 'EXPIRED'

export interface SubscribedMember {
  _id: string
  matrimonyId: string | null
  firstName: string
  lastName: string
  packageName: string | null
  price: number | null
  startDate: string | null
  expiryDate: string | null
  duration: number | null
  durationType: 'DAY' | 'MONTH' | 'YEAR' | null
  status: SubscribedMemberStatus
}

export interface SubscribedMembersPagination {
  currentPage: number
  limit: number
  totalMembers: number
  totalPages: number
}

export interface SubscribedMembersResponse {
  success: boolean
  message?: string
  data: SubscribedMember[]
  pagination: SubscribedMembersPagination
}

export interface GetSubscribedMembersParams {
  page?: number
  limit?: number
  search?: string
}

// ---------- Types: Spotlight ----------
export interface SpotlightStats {
  totalMembers: number
  todayMembers: number
  totalRevenue: number
}

export interface SpotlightStatsResponse {
  success: boolean
  message?: string
  data: SpotlightStats
}

export type SpotlightPaymentStatus = 'ACTIVE' | 'EXPIRED'

export interface SpotlightPayment {
  _id: string
  matrimonyId: string | null
  firstName: string
  lastName: string
  price: number | null
  startDate: string | null
  expiryDate: string | null
  status: SpotlightPaymentStatus
}

export interface SpotlightPaymentsPagination {
  currentPage: number
  limit: number
  totalPayments: number
  totalPages: number
}

export interface SpotlightPaymentsResponse {
  success: boolean
  message?: string
  data: SpotlightPayment[]
  pagination: SpotlightPaymentsPagination
}

export interface GetSpotlightPaymentsParams {
  page?: number
  limit?: number
  search?: string
}

// ---------- Types: Biodata ----------
export interface BiodataStats {
  totalMembers: number
  todayMembers: number
  totalRevenue: number
}

export interface BiodataStatsResponse {
  success: boolean
  message?: string
  data: BiodataStats
}

export interface BiodataPayment {
  _id: string
  matrimonyId: string | null
  firstName: string
  lastName: string
  price: number | null
  createdAt: string | null
}

export interface BiodataPaymentsPagination {
  currentPage: number
  limit: number
  totalPayments: number
  totalPages: number
}

export interface BiodataPaymentsResponse {
  success: boolean
  message?: string
  data: BiodataPayment[]
  pagination: BiodataPaymentsPagination
}

export interface GetBiodataPaymentsParams {
  page?: number
  limit?: number
  search?: string
}

// ---------- API slice ----------
export const paymentStatsApi = createApi({
  reducerPath: 'paymentStatsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['PaymentStats', 'SubscribedMembers', 'SpotlightStats', 'SpotlightPayments', 'BiodataStats', 'BiodataPayments'],
  endpoints: (builder) => ({
    // GET /admin/payment/subscription-stats
    getSubscriptionStats: builder.query<SubscriptionStatsResponse, void>({
      query: () => ({
        url: '/admin/payment/subscription-stats',
        method: 'GET',
      }),
      providesTags: ['PaymentStats'],
    }),

    // GET /admin/payment/subscribed-members?page=&limit=&search=
    getSubscribedMembers: builder.query<SubscribedMembersResponse, GetSubscribedMembersParams | void>({
      query: (params) => ({
        url: '/admin/payment/subscribed-members',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['SubscribedMembers'],
    }),

    // GET /admin/payment/spotlight-stats
    getSpotlightStats: builder.query<SpotlightStatsResponse, void>({
      query: () => ({
        url: '/admin/payment/spotlight-stats',
        method: 'GET',
      }),
      providesTags: ['SpotlightStats'],
    }),

    // GET /admin/payment/spotlight-payments?page=&limit=&search=
    getSpotlightPayments: builder.query<SpotlightPaymentsResponse, GetSpotlightPaymentsParams | void>({
      query: (params) => ({
        url: '/admin/payment/spotlight-payments',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['SpotlightPayments'],
    }),

    // GET /admin/payment/biodata-stats
    getBiodataStats: builder.query<BiodataStatsResponse, void>({
      query: () => ({
        url: '/admin/payment/biodata-stats',
        method: 'GET',
      }),
      providesTags: ['BiodataStats'],
    }),

    // GET /admin/payment/biodata-payments?page=&limit=&search=
    getBiodataPayments: builder.query<BiodataPaymentsResponse, GetBiodataPaymentsParams | void>({
      query: (params) => ({
        url: '/admin/payment/biodata-payments',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['BiodataPayments'],
    }),
  }),
})

export const {
  useGetSubscriptionStatsQuery,
  useGetSubscribedMembersQuery,
  useGetSpotlightStatsQuery,
  useGetSpotlightPaymentsQuery,
  useGetBiodataStatsQuery,
  useGetBiodataPaymentsQuery,
} = paymentStatsApi
