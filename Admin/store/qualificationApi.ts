// qualificationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface Qualification {
  _id: string
  qualification: string
  educationType: string
  occupation: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface QualificationResponse {
  success: boolean
  message?: string
  data: Qualification
}

export interface QualificationListResponse {
  success: boolean
  count?: number
  data: Qualification[]
}

export interface CreateQualificationRequest {
  qualification: string
  educationType: string
  occupation: string
}

export interface UpdateQualificationRequest extends Partial<CreateQualificationRequest> {
  id: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const qualificationApi = createApi({
  reducerPath: 'qualificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Qualification'],
  endpoints: (builder) => ({
    createQualification: builder.mutation<QualificationResponse, CreateQualificationRequest>({
      query: (body) => ({
        url: '/admin/qualification',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Qualification'],
    }),

    getQualifications: builder.query<QualificationListResponse, void>({
      query: () => ({
        url: '/admin/qualification',
        method: 'GET',
      }),
      providesTags: ['Qualification'],
    }),

    getQualificationById: builder.query<QualificationResponse, string>({
      query: (id) => ({
        url: `/admin/qualification/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Qualification', id }],
    }),

    updateQualification: builder.mutation<QualificationResponse, UpdateQualificationRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/qualification/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Qualification', id }, 'Qualification'],
    }),

    deleteQualification: builder.mutation<QualificationResponse, string>({
      query: (id) => ({
        url: `/admin/qualification/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Qualification'],
    }),
  }),
})

export const {
  useCreateQualificationMutation,
  useGetQualificationsQuery,
  useGetQualificationByIdQuery,
  useUpdateQualificationMutation,
  useDeleteQualificationMutation,
} = qualificationApi
