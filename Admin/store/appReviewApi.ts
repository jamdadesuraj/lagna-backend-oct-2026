// appReviewApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

// ---------- Types ----------
export interface ReviewProfileRef {
  _id: string
  matrimonyId?: string
  photos?: string[]
  basicDetails?: {
    firstName?: string
    lastName?: string
  }
}

export interface AppReview {
  _id: string
  profileId: ReviewProfileRef | null
  rating: number
  review: string
  createdAt: string
  updatedAt: string
}

export interface AppReviewListResponse {
  success: boolean
  message?: string
  data: AppReview[]
}

export interface DeleteAppReviewResponse {
  success: boolean
  message?: string
}

// ---------- API slice ----------
export const appReviewApi = createApi({
  reducerPath: 'appReviewApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AppReview'],
  endpoints: (builder) => ({
    // GET /app-review
    getAppReviews: builder.query<AppReviewListResponse, void>({
      query: () => ({
        url: '/app-review',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ _id }) => ({ type: 'AppReview' as const, id: _id })), { type: 'AppReview' as const, id: 'LIST' }]
          : [{ type: 'AppReview' as const, id: 'LIST' }],
    }),

    // DELETE /app-review/:id
    deleteAppReview: builder.mutation<DeleteAppReviewResponse, string>({
      query: (id) => ({
        url: `/app-review/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'AppReview', id },
        { type: 'AppReview', id: 'LIST' },
      ],
    }),
  }),
})

export const { useGetAppReviewsQuery, useDeleteAppReviewMutation } = appReviewApi
