// successStoryApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface SuccessStory {
  _id: string
  groomName: string
  brideName: string
  badge: string
  marriedDate: string
  location: string
  story: string
  year: number
  image: string
  isActive: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

export interface SuccessStoryResponse {
  success: boolean
  message?: string
  data: SuccessStory
}

export interface SuccessStoryListResponse {
  success: boolean
  total: number
  page: number
  limit: number
  data: SuccessStory[]
}

export interface GetSuccessStoriesParams {
  page?: number
  limit?: number
  search?: string
  year?: number
}

export interface CreateSuccessStoryRequest {
  groomName: string
  brideName: string
  badge?: string
  marriedDate: string // ISO date string e.g. "2026-01-01"
  location: string
  story: string
  year: number
  image: File
  isActive: boolean
}

export interface UpdateSuccessStoryRequest extends Partial<Omit<CreateSuccessStoryRequest, 'image'>> {
  id: string
  image?: File | null // omit or null = keep existing image
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- Helper: build multipart form data ----------
const buildSuccessStoryFormData = (body: Partial<Omit<CreateSuccessStoryRequest, 'image'>> & { image?: File | null }) => {
  const formData = new FormData()
  if (body.groomName !== undefined) formData.append('groomName', body.groomName)
  if (body.brideName !== undefined) formData.append('brideName', body.brideName)
  if (body.badge !== undefined) formData.append('badge', body.badge)
  if (body.marriedDate !== undefined) formData.append('marriedDate', body.marriedDate)
  if (body.location !== undefined) formData.append('location', body.location)
  if (body.story !== undefined) formData.append('story', body.story)
  if (body.year !== undefined) formData.append('year', String(body.year))
  if (body.isActive !== undefined) formData.append('isActive', String(body.isActive))
  if (body.image) formData.append('image', body.image) // File — only appended if a new one was picked
  return formData
}

// ---------- API slice ----------
export const successStoryApi = createApi({
  reducerPath: 'successStoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
      // do not set Content-Type — the browser sets the multipart boundary for FormData
    },
  }),
  tagTypes: ['SuccessStory'],
  endpoints: (builder) => ({
    createSuccessStory: builder.mutation<SuccessStoryResponse, CreateSuccessStoryRequest>({
      query: (body) => ({
        url: '/success-stories',
        method: 'POST',
        body: buildSuccessStoryFormData(body),
      }),
      invalidatesTags: ['SuccessStory'],
    }),

    getSuccessStories: builder.query<SuccessStoryListResponse, GetSuccessStoriesParams | void>({
      query: (params) => ({
        url: '/success-stories',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['SuccessStory'],
    }),

    getSuccessStoryById: builder.query<SuccessStoryResponse, string>({
      query: (id) => ({
        url: `/success-stories/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'SuccessStory', id }],
    }),

    updateSuccessStory: builder.mutation<SuccessStoryResponse, UpdateSuccessStoryRequest>({
      query: ({ id, ...body }) => ({
        url: `/success-stories/${id}`,
        method: 'PUT',
        body: buildSuccessStoryFormData(body),
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'SuccessStory', id }, 'SuccessStory'],
    }),

    deleteSuccessStory: builder.mutation<SuccessStoryResponse, string>({
      query: (id) => ({
        url: `/success-stories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SuccessStory'],
    }),
  }),
})

export const {
  useCreateSuccessStoryMutation,
  useGetSuccessStoriesQuery,
  useGetSuccessStoryByIdQuery,
  useUpdateSuccessStoryMutation,
  useDeleteSuccessStoryMutation,
} = successStoryApi
