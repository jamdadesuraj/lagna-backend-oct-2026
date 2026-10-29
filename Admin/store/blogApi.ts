// blogApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface Blog {
  _id: string
  image: string
  title: string
  subtitle: string
  desc: string
  isActive: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface BlogResponse {
  success: boolean
  message?: string
  data: Blog
}

export interface BlogListResponse {
  success: boolean
  message?: string
  data: Blog[]
}

// Create/update use multipart/form-data (image may be a file), so the
// payload is built as FormData by the caller/component, not a plain object.
export interface UpdateBlogRequest {
  id: string
  formData: FormData
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    createBlog: builder.mutation<BlogResponse, FormData>({
      query: (formData) => ({
        url: '/admin/blogs',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Blog'],
    }),

    getBlogs: builder.query<BlogListResponse, void>({
      query: () => ({
        url: '/admin/blogs',
        method: 'GET',
      }),
      providesTags: ['Blog'],
    }),

    getBlogById: builder.query<BlogResponse, string>({
      query: (id) => ({
        url: `/admin/blogs/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Blog', id }],
    }),

    updateBlog: builder.mutation<BlogResponse, UpdateBlogRequest>({
      query: ({ id, formData }) => ({
        url: `/admin/blogs/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),

    deleteBlog: builder.mutation<BlogResponse, string>({
      query: (id) => ({
        url: `/admin/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
})

export const { useCreateBlogMutation, useGetBlogsQuery, useGetBlogByIdQuery, useUpdateBlogMutation, useDeleteBlogMutation } = blogApi
