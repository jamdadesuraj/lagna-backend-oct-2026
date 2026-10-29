// onboardingApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export interface OnboardingItem {
  _id: string
  title: string
  description: string
  image: string
  status: 'Active' | 'Inactive'
}

export interface OnboardingListResponse {
  success: boolean
  message?: string
  data: OnboardingItem[]
}

export interface AddOnboardingPayload {
  title: string
  description: string
  status?: 'Active' | 'Inactive'
  image: File
}

export interface UpdateOnboardingPayload {
  itemId: string
  title?: string
  description?: string
  status?: 'Active' | 'Inactive'
  image?: File
}

// ---------- Helpers ----------
const buildFormData = (fields: Record<string, string | File | undefined>) => {
  const formData = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value)
  })
  return formData
}

// ---------- API slice ----------
export const onboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Onboarding'],
  endpoints: (builder) => ({
    getOnboarding: builder.query<OnboardingListResponse, void>({
      query: () => ({
        url: '/on-boarding',
        method: 'GET',
      }),
      providesTags: ['Onboarding'],
    }),

    addOnboardingItem: builder.mutation<OnboardingListResponse, AddOnboardingPayload>({
      query: ({ title, description, status, image }) => ({
        url: '/on-boarding',
        method: 'POST',
        body: buildFormData({ title, description, status, image }),
      }),
      invalidatesTags: ['Onboarding'],
    }),

    updateOnboardingItem: builder.mutation<OnboardingListResponse, UpdateOnboardingPayload>({
      query: ({ itemId, ...fields }) => ({
        url: `/on-boarding/${itemId}`,
        method: 'PATCH',
        body: buildFormData(fields),
      }),
      invalidatesTags: ['Onboarding'],
    }),

    deleteOnboardingItem: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (itemId) => ({
        url: `/on-boarding/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Onboarding'],
    }),
  }),
})

export const { useGetOnboardingQuery, useAddOnboardingItemMutation, useUpdateOnboardingItemMutation, useDeleteOnboardingItemMutation } = onboardingApi
