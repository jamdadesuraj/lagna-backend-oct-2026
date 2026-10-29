import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken')
    const refreshResult = await rawBaseQuery({ url: '/admin/auth/refresh-token', method: 'POST', body: { refreshToken } }, api, extraOptions)
    if (refreshResult.data) {
      const { data } = refreshResult.data as { data: { accessToken: string; refreshToken: string } }
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
  }
  return result
}
