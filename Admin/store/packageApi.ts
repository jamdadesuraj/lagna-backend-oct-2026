// packageApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Package {
  _id: string
  title: string
  description: string
  duration: number
  durationType: 'DAY' | 'MONTH' | 'YEAR' | string
  price: number
  originalPrice: number
  discountPercentage: number
  badge?: string
  features: string[]
  displayOrder: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface PackageResponse {
  success: boolean
  message?: string
  data: Package
}

export interface PackageListResponse {
  success: boolean
  count?: number
  data: Package[]
}

export interface CreatePackageRequest {
  title: string
  description: string
  duration: number
  durationType: string
  price: number
  originalPrice: number
  discountPercentage: number
  badge?: string
  features: string[]
  displayOrder: number
}

export interface UpdatePackageRequest extends Partial<CreatePackageRequest> {
  id: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in .env.local')
}

export const packageApi = createApi({
  reducerPath: 'packageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Package'],
  endpoints: (builder) => ({
    createPackage: builder.mutation<PackageResponse, CreatePackageRequest>({
      query: (body) => ({ url: '/admin/package', method: 'POST', body }),
      invalidatesTags: ['Package'],
    }),
    getPackages: builder.query<PackageListResponse, void>({
      query: () => ({ url: '/admin/package', method: 'GET' }),
      providesTags: ['Package'],
    }),
    getPackageById: builder.query<PackageResponse, string>({
      query: (id) => ({ url: `/admin/package/${id}`, method: 'GET' }),
      providesTags: (_r, _e, id) => [{ type: 'Package', id }],
    }),
    updatePackage: builder.mutation<PackageResponse, UpdatePackageRequest>({
      query: ({ id, ...body }) => ({ url: `/admin/package/${id}`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Package', id }, 'Package'],
    }),
    deletePackage: builder.mutation<PackageResponse, string>({
      query: (id) => ({ url: `/admin/package/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Package'],
    }),
  }),
})

export const { useCreatePackageMutation, useGetPackagesQuery, useGetPackageByIdQuery, useUpdatePackageMutation, useDeletePackageMutation } =
  packageApi
