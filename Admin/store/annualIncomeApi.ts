// annualIncomeApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface AnnualIncome {
  _id: string
  annualIncome: string
  minIncome: number
  maxIncome: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface AnnualIncomeResponse {
  success: boolean
  message?: string
  data: AnnualIncome
}

export interface AnnualIncomeListResponse {
  success: boolean
  count: number
  data: AnnualIncome[]
}

export interface CreateAnnualIncomeRequest {
  annualIncome: string
  minIncome: number
  maxIncome: number
}

export interface UpdateAnnualIncomeRequest {
  id: string
  annualIncome: string
  minIncome: number
  maxIncome: number
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const annualIncomeApi = createApi({
  reducerPath: 'annualIncomeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['AnnualIncome'],
  endpoints: (builder) => ({
    createAnnualIncome: builder.mutation<AnnualIncomeResponse, CreateAnnualIncomeRequest>({
      query: (body) => ({
        url: '/admin/annual-income',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AnnualIncome'],
    }),

    getAnnualIncomes: builder.query<AnnualIncomeListResponse, void>({
      query: () => ({
        url: '/admin/annual-income',
        method: 'GET',
      }),
      providesTags: ['AnnualIncome'],
    }),

    getAnnualIncomeById: builder.query<AnnualIncomeResponse, string>({
      query: (id) => ({
        url: `/admin/annual-income/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'AnnualIncome', id }],
    }),

    updateAnnualIncome: builder.mutation<AnnualIncomeResponse, UpdateAnnualIncomeRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/annual-income/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'AnnualIncome', id }, 'AnnualIncome'],
    }),

    deleteAnnualIncome: builder.mutation<AnnualIncomeResponse, string>({
      query: (id) => ({
        url: `/admin/annual-income/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AnnualIncome'],
    }),
  }),
})

export const {
  useCreateAnnualIncomeMutation,
  useGetAnnualIncomesQuery,
  useGetAnnualIncomeByIdQuery,
  useUpdateAnnualIncomeMutation,
  useDeleteAnnualIncomeMutation,
} = annualIncomeApi
