// casteApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface ReligionRef {
  _id: string
  religion: string
}

export interface Caste {
  _id: string
  religionId: ReligionRef
  caste: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CasteResponse {
  success: boolean
  message?: string
  data: Caste
}

export interface CasteListResponse {
  success: boolean
  count: number
  data: Caste[]
}

export interface CreateCasteRequest {
  religionId: string
  caste: string
}

export interface UpdateCasteRequest {
  id: string
  religionId: string
  caste: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const casteApi = createApi({
  reducerPath: 'casteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Caste'],
  endpoints: (builder) => ({
    createCaste: builder.mutation<CasteResponse, CreateCasteRequest>({
      query: (body) => ({
        url: '/admin/caste',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Caste'],
    }),

    getCastes: builder.query<CasteListResponse, void>({
      query: () => ({
        url: '/admin/caste',
        method: 'GET',
      }),
      providesTags: ['Caste'],
    }),

    getCasteById: builder.query<CasteResponse, string>({
      query: (id) => ({
        url: `/admin/caste/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Caste', id }],
    }),

    updateCaste: builder.mutation<CasteResponse, UpdateCasteRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/caste/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Caste', id }, 'Caste'],
    }),
    getCastesByReligion: builder.query<CasteListResponse, string>({
      query: (religionId) => ({
        url: `/admin/caste/religion/${religionId}`,
        method: 'GET',
      }),
      providesTags: ['Caste'],
    }),
    deleteCaste: builder.mutation<CasteResponse, string>({
      query: (id) => ({
        url: `/admin/caste/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Caste'],
    }),
  }),
})

export const {
  useGetCastesByReligionQuery,
  useCreateCasteMutation,
  useGetCastesQuery,
  useGetCasteByIdQuery,
  useUpdateCasteMutation,
  useDeleteCasteMutation,
} = casteApi
