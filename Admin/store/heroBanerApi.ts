// heroBannerApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export interface HeroBanner {
  _id: string
  image: string
  badge: string
  title: string
  description: string
  displayOrder: number
  isActive: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface HeroBannerResponse {
  success: boolean
  message?: string
  data: HeroBanner
}

export interface HeroBannerListResponse {
  success: boolean
  count?: number
  data: HeroBanner[]
}

// Create uses multipart/form-data (image is a required file), so the
// payload is built as FormData by the caller/component, not a plain object.
export interface UpdateHeroBannerRequest {
  id: string
  formData: FormData
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const heroBannerApi = createApi({
  reducerPath: 'heroBannerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['HeroBanner'],
  endpoints: (builder) => ({
    createHeroBanner: builder.mutation<HeroBannerResponse, FormData>({
      query: (formData) => ({
        url: '/admin/hero-banner',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['HeroBanner'],
    }),

    getHeroBanners: builder.query<HeroBannerListResponse, void>({
      query: () => ({
        url: '/admin/hero-banner',
        method: 'GET',
      }),
      providesTags: ['HeroBanner'],
    }),

    getHeroBannerById: builder.query<HeroBannerResponse, string>({
      query: (id) => ({
        url: `/admin/hero-banner/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'HeroBanner', id }],
    }),

    updateHeroBanner: builder.mutation<HeroBannerResponse, UpdateHeroBannerRequest>({
      query: ({ id, formData }) => ({
        url: `/admin/hero-banner/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'HeroBanner', id }, 'HeroBanner'],
    }),

    deleteHeroBanner: builder.mutation<HeroBannerResponse, string>({
      query: (id) => ({
        url: `/admin/hero-banner/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HeroBanner'],
    }),
  }),
})

export const {
  useCreateHeroBannerMutation,
  useGetHeroBannersQuery,
  useGetHeroBannerByIdQuery,
  useUpdateHeroBannerMutation,
  useDeleteHeroBannerMutation,
} = heroBannerApi
