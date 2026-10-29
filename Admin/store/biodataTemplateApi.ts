// biodataTemplateApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export type BiodataTemplateStatus = 'active' | 'inactive'

export interface BiodataTemplate {
  _id: string
  template: string
  title: string
  description: string
  price: number
  status: BiodataTemplateStatus
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

export interface BiodataTemplateResponse {
  success: boolean
  message?: string
  data: BiodataTemplate
}

export interface BiodataTemplateListResponse {
  success: boolean
  message?: string
  total: number
  page: number
  limit: number
  data: BiodataTemplate[]
}

// GET /admin/biodata-templates?page=&limit=&search=&status=
export interface GetBiodataTemplatesParams {
  page?: number
  limit?: number
  search?: string
  status?: BiodataTemplateStatus
}

// Create/Update use multipart/form-data (template image is a file),
// so the payload is built as FormData by the caller/component.
// price must be appended to that FormData as a string, e.g.
// formData.append('price', String(price)) — the backend coerces it
// back to a number during validation.
export interface UpdateBiodataTemplateRequest {
  id: string
  formData: FormData
}

export interface UpdateBiodataTemplateStatusRequest {
  id: string
  status: BiodataTemplateStatus
}

// ---------- API slice ----------
export const biodataTemplateApi = createApi({
  reducerPath: 'biodataTemplateApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['BiodataTemplate'],
  endpoints: (builder) => ({
    createBiodataTemplate: builder.mutation<BiodataTemplateResponse, FormData>({
      query: (formData) => ({
        url: '/admin/biodata-templates',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['BiodataTemplate'],
    }),

    getBiodataTemplates: builder.query<BiodataTemplateListResponse, GetBiodataTemplatesParams | void>({
      query: (params) => ({
        url: '/admin/biodata-templates',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result ? [...result.data.map(({ _id }) => ({ type: 'BiodataTemplate' as const, id: _id })), 'BiodataTemplate'] : ['BiodataTemplate'],
    }),

    getBiodataTemplateById: builder.query<BiodataTemplateResponse, string>({
      query: (id) => ({
        url: `/admin/biodata-templates/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'BiodataTemplate', id }],
    }),

    updateBiodataTemplate: builder.mutation<BiodataTemplateResponse, UpdateBiodataTemplateRequest>({
      query: ({ id, formData }) => ({
        url: `/admin/biodata-templates/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'BiodataTemplate', id }, 'BiodataTemplate'],
    }),

    updateBiodataTemplateStatus: builder.mutation<BiodataTemplateResponse, UpdateBiodataTemplateStatusRequest>({
      query: ({ id, status }) => ({
        url: `/admin/biodata-templates/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'BiodataTemplate', id }, 'BiodataTemplate'],
    }),

    deleteBiodataTemplate: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/admin/biodata-templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BiodataTemplate'],
    }),
  }),
})

export const {
  useCreateBiodataTemplateMutation,
  useGetBiodataTemplatesQuery,
  useGetBiodataTemplateByIdQuery,
  useUpdateBiodataTemplateMutation,
  useUpdateBiodataTemplateStatusMutation,
  useDeleteBiodataTemplateMutation,
} = biodataTemplateApi
