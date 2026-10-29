// adminNotificationApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export type AdminNotificationType = 'PROFILE_VERIFICATION' | 'PAYMENT_RECEIVED' | 'REPORT_PROFILE'

export interface AdminNotification {
  _id: string
  type: AdminNotificationType
  title: string
  message: string
  profileId?: string | null
  referenceId?: string | null
  meta?: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminNotificationsPagination {
  currentPage: number
  limit: number
  totalNotifications: number
  totalPages: number
}

export interface AdminNotificationsResponse {
  success: boolean
  message?: string
  data: AdminNotification[]
  unreadCount: number
  pagination: AdminNotificationsPagination
}

// GET /admin/notifications?page=&limit=&unread=&type=
export interface GetAdminNotificationsParams {
  page?: number
  limit?: number
  unread?: boolean
  type?: AdminNotificationType
}

export interface MarkNotificationReadResponse {
  success: boolean
  message?: string
  data: AdminNotification
}

export interface AdminNotificationActionResponse {
  success: boolean
  message?: string
  data?: { modifiedCount?: number; deletedCount?: number }
}

// ---------- API slice ----------
export const adminNotificationApi = createApi({
  reducerPath: 'adminNotificationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AdminNotifications'],
  endpoints: (builder) => ({
    // GET /admin/notifications
    // For the bell, pass { pollingInterval: 30000 } as the hook's 2nd argument
    getAdminNotifications: builder.query<AdminNotificationsResponse, GetAdminNotificationsParams | void>({
      query: (params) => ({
        url: '/admin/notifications',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['AdminNotifications'],
    }),

    // PATCH /admin/notifications/:id/read
    markNotificationRead: builder.mutation<MarkNotificationReadResponse, string>({
      query: (id) => ({
        url: `/admin/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminNotifications'],
    }),

    // PATCH /admin/notifications/read-all
    markAllNotificationsRead: builder.mutation<AdminNotificationActionResponse, void>({
      query: () => ({
        url: '/admin/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminNotifications'],
    }),

    // DELETE /admin/notifications/clear-all
    clearAllNotifications: builder.mutation<AdminNotificationActionResponse, void>({
      query: () => ({
        url: '/admin/notifications/clear-all',
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminNotifications'],
    }),
  }),
})

export const {
  useGetAdminNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useClearAllNotificationsMutation,
} = adminNotificationApi
