// careersApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface Careers {
  _id: string
  title: string
  subtitle: string
  images: string[]
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface CareersResponse {
  success: boolean
  message?: string
  data: Careers
}

// Save uses multipart/form-data (title/subtitle fields + optional new
// image files), so the payload is built as FormData by the caller/component.
export interface SaveCareersRequest {
  formData: FormData
}

export interface RemoveCareerImageRequest {
  image: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const careersApi = createApi({
  reducerPath: 'careersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Careers'],
  endpoints: (builder) => ({
    // Upserts the single Careers page document. New image files uploaded
    // via formData are appended to the existing gallery on the backend.
    saveCareers: builder.mutation<CareersResponse, SaveCareersRequest>({
      query: ({ formData }) => ({
        url: '/admin/careers',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Careers'],
    }),

    getCareers: builder.query<CareersResponse, void>({
      query: () => ({
        url: '/admin/careers',
        method: 'GET',
      }),
      providesTags: ['Careers'],
    }),

    removeCareerImage: builder.mutation<CareersResponse, RemoveCareerImageRequest>({
      query: ({ image }) => ({
        url: '/admin/careers/image',
        method: 'DELETE',
        body: { image },
      }),
      invalidatesTags: ['Careers'],
    }),

    deleteCareers: builder.mutation<CareersResponse, void>({
      query: () => ({
        url: '/admin/careers',
        method: 'DELETE',
      }),
      invalidatesTags: ['Careers'],
    }),
  }),
})

export const { useSaveCareersMutation, useGetCareersQuery, useRemoveCareerImageMutation, useDeleteCareersMutation } = careersApi
