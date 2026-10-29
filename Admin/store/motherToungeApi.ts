// motherTongueApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface MotherTongue {
  _id: string
  motherTongue: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface MotherTongueResponse {
  success: boolean
  message?: string
  data: MotherTongue
}

export interface MotherTongueListResponse {
  success: boolean
  message?: string
  data: MotherTongue[]
}

export interface CreateMotherTongueRequest {
  motherTongue: string
}

export interface UpdateMotherTongueRequest {
  id: string
  motherTongue: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const motherTongueApi = createApi({
  reducerPath: 'motherTongueApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['MotherTongue'],
  endpoints: (builder) => ({
    createMotherTongue: builder.mutation<MotherTongueResponse, CreateMotherTongueRequest>({
      query: (body) => ({
        url: '/admin/mother-tongue',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MotherTongue'],
    }),

    getMotherTongues: builder.query<MotherTongueListResponse, void>({
      query: () => ({
        url: '/admin/mother-tongue',
        method: 'GET',
      }),
      providesTags: ['MotherTongue'],
    }),

    getMotherTongueById: builder.query<MotherTongueResponse, string>({
      query: (id) => ({
        url: `/admin/mother-tongue/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'MotherTongue', id }],
    }),

    updateMotherTongue: builder.mutation<MotherTongueResponse, UpdateMotherTongueRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/mother-tongue/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'MotherTongue', id }, 'MotherTongue'],
    }),

    deleteMotherTongue: builder.mutation<MotherTongueResponse, string>({
      query: (id) => ({
        url: `/admin/mother-tongue/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MotherTongue'],
    }),
  }),
})

export const {
  useCreateMotherTongueMutation,
  useGetMotherTonguesQuery,
  useGetMotherTongueByIdQuery,
  useUpdateMotherTongueMutation,
  useDeleteMotherTongueMutation,
} = motherTongueApi
