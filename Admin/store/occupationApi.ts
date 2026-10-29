// occupationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface Occupation {
  _id: string
  occupation: string
  createdBy: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface OccupationResponse {
  success: boolean
  message?: string
  data: Occupation
}

export interface OccupationListResponse {
  success: boolean
  count: number
  data: Occupation[]
}

export interface CreateOccupationRequest {
  occupation: string
}

export interface UpdateOccupationRequest {
  id: string
  occupation: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const occupationApi = createApi({
  reducerPath: 'occupationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Occupation'],
  endpoints: (builder) => ({
    createOccupation: builder.mutation<OccupationResponse, CreateOccupationRequest>({
      query: (body) => ({
        url: '/admin/occupation',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Occupation'],
    }),

    getOccupations: builder.query<OccupationListResponse, void>({
      query: () => ({
        url: '/admin/occupation',
        method: 'GET',
      }),
      providesTags: ['Occupation'],
    }),

    getOccupationById: builder.query<OccupationResponse, string>({
      query: (id) => ({
        url: `/admin/occupation/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Occupation', id }],
    }),

    updateOccupation: builder.mutation<OccupationResponse, UpdateOccupationRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/occupation/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Occupation', id }, 'Occupation'],
    }),

    deleteOccupation: builder.mutation<OccupationResponse, string>({
      query: (id) => ({
        url: `/admin/occupation/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Occupation'],
    }),
  }),
})

export const {
  useCreateOccupationMutation,
  useGetOccupationsQuery,
  useGetOccupationByIdQuery,
  useUpdateOccupationMutation,
  useDeleteOccupationMutation,
} = occupationApi
