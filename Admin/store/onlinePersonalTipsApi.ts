// onlinePersonalTipsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export const PERSONAL_TIP_CATEGORIES = ['Personal Tips', 'Safety Tips', 'Success Tips', 'Relationship Tips'] as const

export type PersonalTipCategory = (typeof PERSONAL_TIP_CATEGORIES)[number]

export interface OnlinePersonalTip {
  _id: string
  category: PersonalTipCategory
  image: string
  title: string
  subTitle: string
  displayOrder: number
  isActive: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

export interface OnlinePersonalTipResponse {
  success: boolean
  message?: string
  data: OnlinePersonalTip
}

export interface OnlinePersonalTipListResponse {
  success: boolean
  message?: string
  data: OnlinePersonalTip[]
}

export interface CreateOnlinePersonalTipRequest {
  category: PersonalTipCategory
  image: File
  title: string
  subTitle: string
  displayOrder: number
  isActive: boolean
}

export interface UpdateOnlinePersonalTipRequest extends Partial<Omit<CreateOnlinePersonalTipRequest, 'image'>> {
  id: string
  image?: File | null // omit or null = keep existing image
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

const buildTipFormData = (body: Partial<Omit<CreateOnlinePersonalTipRequest, 'image'>> & { image?: File | null }) => {
  const formData = new FormData()
  if (body.category !== undefined) formData.append('category', body.category)
  if (body.title !== undefined) formData.append('title', body.title)
  if (body.subTitle !== undefined) formData.append('subTitle', body.subTitle)
  if (body.displayOrder !== undefined) formData.append('displayOrder', String(body.displayOrder))
  if (body.isActive !== undefined) formData.append('isActive', String(body.isActive))
  if (body.image) formData.append('image', body.image)
  return formData
}

// ---------- API slice ----------
export const onlinePersonalTipsApi = createApi({
  reducerPath: 'onlinePersonalTipsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
      // do not set Content-Type — the browser sets the multipart boundary for FormData
    },
  }),
  tagTypes: ['OnlinePersonalTip'],
  endpoints: (builder) => ({
    createOnlinePersonalTip: builder.mutation<OnlinePersonalTipResponse, CreateOnlinePersonalTipRequest>({
      query: (body) => ({
        url: '/admin/online-personal-tips',
        method: 'POST',
        body: buildTipFormData(body),
      }),
      invalidatesTags: ['OnlinePersonalTip'],
    }),

    getOnlinePersonalTips: builder.query<OnlinePersonalTipListResponse, void>({
      query: () => ({
        url: '/admin/online-personal-tips',
        method: 'GET',
      }),
      providesTags: ['OnlinePersonalTip'],
    }),

    getOnlinePersonalTipById: builder.query<OnlinePersonalTipResponse, string>({
      query: (id) => ({
        url: `/admin/online-personal-tips/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'OnlinePersonalTip', id }],
    }),

    updateOnlinePersonalTip: builder.mutation<OnlinePersonalTipResponse, UpdateOnlinePersonalTipRequest>({
      query: ({ id, ...body }) => ({
        url: `/admin/online-personal-tips/${id}`,
        method: 'PUT',
        body: buildTipFormData(body),
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'OnlinePersonalTip', id }, 'OnlinePersonalTip'],
    }),

    deleteOnlinePersonalTip: builder.mutation<OnlinePersonalTipResponse, string>({
      query: (id) => ({
        url: `/admin/online-personal-tips/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OnlinePersonalTip'],
    }),
  }),
})

export const {
  useCreateOnlinePersonalTipMutation,
  useGetOnlinePersonalTipsQuery,
  useGetOnlinePersonalTipByIdQuery,
  useUpdateOnlinePersonalTipMutation,
  useDeleteOnlinePersonalTipMutation,
} = onlinePersonalTipsApi
