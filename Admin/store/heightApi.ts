// heightApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface Height {
  _id: string
  height: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface HeightResponse {
  success: boolean
  message?: string
  data: Height
}

export interface HeightListResponse {
  success: boolean
  count?: number
  data: Height[]
}

export interface CreateHeightRequest {
  height: string
}

export interface UpdateHeightRequest extends Partial<CreateHeightRequest> {
  id: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const heightApi = createApi({
  reducerPath: 'heightApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Height'],
  endpoints: (builder) => ({
    createHeight: builder.mutation<HeightResponse, CreateHeightRequest>({
      query: (body) => ({
        url: '/admin/height',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Height'],
    }),

    getHeights: builder.query<HeightListResponse, void>({
      query: () => ({
        url: '/admin/height',
        method: 'GET',
      }),
      providesTags: ['Height'],
    }),

    getHeightById: builder.query<HeightResponse, string>({
      query: (id) => ({
        url: `/admin/height/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Height', id }],
    }),

    updateHeight: builder.mutation<HeightResponse, UpdateHeightRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/height/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Height', id }, 'Height'],
    }),

    deleteHeight: builder.mutation<HeightResponse, string>({
      query: (id) => ({
        url: `/admin/height/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Height'],
    }),
  }),
})

export const { useCreateHeightMutation, useGetHeightsQuery, useGetHeightByIdQuery, useUpdateHeightMutation, useDeleteHeightMutation } = heightApi
