// subCasteApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface ReligionRef {
  _id: string
  religion: string
}

export interface CasteRef {
  _id: string
  caste: string
}

export interface SubCaste {
  _id: string
  religionId: ReligionRef
  casteId: CasteRef
  subCaste: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface SubCasteResponse {
  success: boolean
  message?: string
  data: SubCaste
}

export interface SubCasteListResponse {
  success: boolean
  count: number
  data: SubCaste[]
}

export interface CreateSubCasteRequest {
  religionId: string
  casteId: string
  subCaste: string
}

export interface UpdateSubCasteRequest {
  id: string
  religionId: string
  casteId: string
  subCaste: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const subCasteApi = createApi({
  reducerPath: 'subCasteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['SubCaste'],
  endpoints: (builder) => ({
    createSubCaste: builder.mutation<SubCasteResponse, CreateSubCasteRequest>({
      query: (body) => ({
        url: '/admin/sub-caste',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubCaste'],
    }),

    getSubCastes: builder.query<SubCasteListResponse, void>({
      query: () => ({
        url: '/admin/sub-caste',
        method: 'GET',
      }),
      providesTags: ['SubCaste'],
    }),

    getSubCastesByCaste: builder.query<SubCasteListResponse, string>({
      query: (casteId) => ({
        url: `/admin/sub-caste/caste/${casteId}`,
        method: 'GET',
      }),
      providesTags: ['SubCaste'],
    }),

    getSubCasteById: builder.query<SubCasteResponse, string>({
      query: (id) => ({
        url: `/admin/sub-caste/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'SubCaste', id }],
    }),

    updateSubCaste: builder.mutation<SubCasteResponse, UpdateSubCasteRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/sub-caste/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'SubCaste', id }, 'SubCaste'],
    }),

    deleteSubCaste: builder.mutation<SubCasteResponse, string>({
      query: (id) => ({
        url: `/admin/sub-caste/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SubCaste'],
    }),
  }),
})

export const {
  useCreateSubCasteMutation,
  useGetSubCastesQuery,
  useGetSubCastesByCasteQuery,
  useGetSubCasteByIdQuery,
  useUpdateSubCasteMutation,
  useDeleteSubCasteMutation,
} = subCasteApi
