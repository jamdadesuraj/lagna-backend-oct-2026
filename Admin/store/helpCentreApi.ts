// helpCenterApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface HelpCenter {
  _id: string
  title: string
  description: string
  icon: string
  displayOrder: number
  isActive: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface HelpCenterResponse {
  success: boolean
  message?: string
  data: HelpCenter
}

export interface HelpCenterListResponse {
  success: boolean
  count?: number
  data: HelpCenter[]
}

export interface CreateHelpCenterRequest {
  title: string
  description: string
  icon: File | null
  displayOrder: number
  isActive: boolean
}

export interface UpdateHelpCenterRequest extends Partial<CreateHelpCenterRequest> {
  id: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- Helper: build multipart form data ----------
const buildHelpCenterFormData = (body: Partial<CreateHelpCenterRequest>) => {
  const formData = new FormData()
  if (body.title !== undefined) formData.append('title', body.title)
  if (body.description !== undefined) formData.append('description', body.description)
  if (body.displayOrder !== undefined) formData.append('displayOrder', String(body.displayOrder))
  if (body.isActive !== undefined) formData.append('isActive', String(body.isActive))
  if (body.icon) formData.append('icon', body.icon) // File — only appended if a new one was picked
  return formData
}

// ---------- API slice ----------
export const helpCenterApi = createApi({
  reducerPath: 'helpCenterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
      // NOTE: do not set Content-Type here — the browser must set
      // multipart/form-data with its own boundary for FormData bodies
    },
  }),
  tagTypes: ['HelpCenter'],
  endpoints: (builder) => ({
    createHelpCenter: builder.mutation<HelpCenterResponse, CreateHelpCenterRequest>({
      query: (body) => ({
        url: '/admin/help-center',
        method: 'POST',
        body: buildHelpCenterFormData(body),
      }),
      invalidatesTags: ['HelpCenter'],
    }),

    getHelpCenters: builder.query<HelpCenterListResponse, void>({
      query: () => ({
        url: '/admin/help-center',
        method: 'GET',
      }),
      providesTags: ['HelpCenter'],
    }),

    getHelpCenterById: builder.query<HelpCenterResponse, string>({
      query: (id) => ({
        url: `/admin/help-center/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'HelpCenter', id }],
    }),

    updateHelpCenter: builder.mutation<HelpCenterResponse, UpdateHelpCenterRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/help-center/${id}`,
        method: 'PUT',
        body: buildHelpCenterFormData(body),
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'HelpCenter', id }, 'HelpCenter'],
    }),

    deleteHelpCenter: builder.mutation<HelpCenterResponse, string>({
      query: (id) => ({
        url: `/admin/help-center/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HelpCenter'],
    }),
  }),
})

export const {
  useCreateHelpCenterMutation,
  useGetHelpCentersQuery,
  useGetHelpCenterByIdQuery,
  useUpdateHelpCenterMutation,
  useDeleteHelpCenterMutation,
} = helpCenterApi
