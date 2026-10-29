// contactUsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// ---------- Types ----------
export interface ContactUs {
  _id: string
  officeAddress: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface ContactUsResponse {
  success: boolean
  message?: string
  data: ContactUs
}

export interface CreateOrUpdateContactUsRequest {
  officeAddress: string
  email: string
}

// ---------- Base URL (from env) ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

// ---------- API slice ----------
export const contactUsApi = createApi({
  reducerPath: 'contactUsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['ContactUs'],
  endpoints: (builder) => ({
    createOrUpdateContactUs: builder.mutation<ContactUsResponse, CreateOrUpdateContactUsRequest>({
      query: (body) => ({
        url: '/admin/contact-us',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ContactUs'],
    }),

    getContactUs: builder.query<ContactUsResponse, void>({
      query: () => ({
        url: '/admin/contact-us',
        method: 'GET',
      }),
      // Backend currently returns `data` as an array (ContactUs.find()),
      // so unwrap it to a single object here to keep the component simple.
      transformResponse: (response: { success: boolean; message?: string; data: ContactUs[] | ContactUs }) => ({
        ...response,
        data: Array.isArray(response.data) ? response.data[0] : response.data,
      }),
      providesTags: ['ContactUs'],
    }),
  }),
})

export const { useCreateOrUpdateContactUsMutation, useGetContactUsQuery } = contactUsApi
