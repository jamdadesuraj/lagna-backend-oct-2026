// dashboardApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export interface DashboardStats {
  totalUsers: number
  verifiedUsers: number
  subscribedUsers: number
  blockedUsers: number
  totalRevenue: number
  todayRevenue: number
  biodataRevenue: number
  spotlightRevenue: number
}

export interface DashboardStatsResponse {
  success: boolean
  message?: string
  data: DashboardStats
}

// ---------- API slice ----------
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['DashboardStats'],
  endpoints: (builder) => ({
    // GET /admin/dashboard/stats
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: '/admin/dashboard/stats',
        method: 'GET',
      }),
      providesTags: ['DashboardStats'],
    }),
  }),
})

export const { useGetDashboardStatsQuery } = dashboardApi
