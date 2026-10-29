// religionApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface Religion {
  _id: string
  religion: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ReligionResponse {
  success: boolean
  message?: string
  data: Religion
}

export interface ReligionListResponse {
  success: boolean
  count: number
  data: Religion[]
}

export interface CreateReligionRequest {
  religion: string
}

export interface UpdateReligionRequest {
  id: string
  religion: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const religionApi = createApi({
  reducerPath: 'religionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Religion'],
  endpoints: (builder) => ({
    createReligion: builder.mutation<ReligionResponse, CreateReligionRequest>({
      query: (body) => ({
        url: '/admin/religion',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Religion'],
    }),

    getReligions: builder.query<ReligionListResponse, void>({
      query: () => ({
        url: '/admin/religion',
        method: 'GET',
      }),
      providesTags: ['Religion'],
    }),

    getReligionById: builder.query<ReligionResponse, string>({
      query: (id) => ({
        url: `/admin/religion/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Religion', id }],
    }),

    updateReligion: builder.mutation<ReligionResponse, UpdateReligionRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/religion/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Religion', id }, 'Religion'],
    }),

    deleteReligion: builder.mutation<ReligionResponse, string>({
      query: (id) => ({
        url: `/admin/religion/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Religion'],
    }),
  }),
})

export const { useCreateReligionMutation, useGetReligionsQuery, useGetReligionByIdQuery, useUpdateReligionMutation, useDeleteReligionMutation } =
  religionApi
