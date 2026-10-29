// faqApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface Faq {
  _id: string
  helpCenterId: { _id: string; title: string } | string // populated object on GET, plain id on write
  question: string
  answer: string
  displayOrder: number
  isActive: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface FaqResponse {
  success: boolean
  message?: string
  data: Faq
}

export interface FaqListResponse {
  success: boolean
  count?: number
  data: Faq[]
}

export interface CreateFaqRequest {
  helpCenterId: string
  question: string
  answer: string
  displayOrder: number
  isActive: boolean
}

export interface UpdateFaqRequest extends Partial<CreateFaqRequest> {
  id: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const faqApi = createApi({
  reducerPath: 'faqApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Faq'],
  endpoints: (builder) => ({
    createFaq: builder.mutation<FaqResponse, CreateFaqRequest>({
      query: (body) => ({
        url: '/admin/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Faq'],
    }),

    getFaqs: builder.query<FaqListResponse, void>({
      query: () => ({
        url: '/admin/faqs',
        method: 'GET',
      }),
      providesTags: ['Faq'],
    }),

    getFaqById: builder.query<FaqResponse, string>({
      query: (id) => ({
        url: `/admin/faqs/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Faq', id }],
    }),

    updateFaq: builder.mutation<FaqResponse, UpdateFaqRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/faqs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Faq', id }, 'Faq'],
    }),

    deleteFaq: builder.mutation<FaqResponse, string>({
      query: (id) => ({
        url: `/admin/faqs/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Faq'],
    }),
  }),
})

export const { useCreateFaqMutation, useGetFaqsQuery, useGetFaqByIdQuery, useUpdateFaqMutation, useDeleteFaqMutation } = faqApi
