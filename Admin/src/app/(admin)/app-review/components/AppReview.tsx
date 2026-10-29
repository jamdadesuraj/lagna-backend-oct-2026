'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React, { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { useDeleteAppReviewMutation, useGetAppReviewsQuery } from '../../../../../store/appReviewApi'

const AppReview = () => {
  const { data: reviewsRes, isLoading, isError } = useGetAppReviewsQuery()

  const [deleteAppReview] = useDeleteAppReviewMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase()
  }

  const renderStars = (rating: number) => '⭐'.repeat(Math.max(0, Math.min(5, Math.round(rating))))

  const allReviews = reviewsRes?.data ?? []

  const filteredReviews = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) return allReviews

    return allReviews.filter((item) => {
      const firstName = item.profileId?.basicDetails?.firstName ?? ''
      const lastName = item.profileId?.basicDetails?.lastName ?? ''
      const fullName = `${firstName} ${lastName}`.toLowerCase()
      const matrimonyId = item.profileId?.matrimonyId?.toLowerCase() ?? ''
      const review = item.review?.toLowerCase() ?? ''

      return fullName.includes(search) || matrimonyId.includes(search) || review.includes(search)
    })
  }, [allReviews, searchTerm])

  // ==================================================
  // DELETE
  // ==================================================
  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this review?')

    if (!confirmed) return

    try {
      setDeletingId(id)

      await deleteAppReview(id).unwrap()

      toast.success('Review deleted successfully.')
    } catch (error) {
      console.error('App review delete error:', error)

      toast.error('Failed to delete review.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
        <CardTitle as="h4" className="mb-0">
          App Review List
        </CardTitle>

        <div style={{ width: '100%', maxWidth: '280px' }}>
          <div className="search-box position-relative">
            <input
              type="search"
              className="form-control"
              placeholder="Search member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <i className="ri-search-line position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
          </div>
        </div>
      </CardHeader>

      {/* ================= TABLE ================= */}
      <CardBody className="">
        <div className="table-responsive">
          <table
            className="table align-middle mb-0 table-hover table-centered table-bordered"
            style={{
              minWidth: '1150px',
            }}>
            <thead className="bg-light-subtle">
              <tr>
                <th className="text-center text-nowrap" style={{ width: '45px' }}>
                  <input type="checkbox" className="form-check-input" aria-label="Select all members" />
                </th>

                <th className="text-nowrap">SR.No</th>
                <th className="text-nowrap">Member ID</th>
                <th className="text-nowrap">Member</th>
                <th className="text-nowrap">Rating</th>
                <th className="text-nowrap">Review</th>
                <th className="text-nowrap">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {isLoading && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading reviews...
                  </td>
                </tr>
              )}

              {/* ERROR */}
              {!isLoading && isError && (
                <tr>
                  <td colSpan={7} className="text-center text-danger py-4">
                    Failed to load reviews.
                  </td>
                </tr>
              )}

              {/* EMPTY */}
              {!isLoading && !isError && filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    {searchTerm.trim() ? 'No reviews match your search.' : 'No reviews found.'}
                  </td>
                </tr>
              )}

              {/* ROWS */}
              {!isLoading &&
                !isError &&
                filteredReviews.map((item, index) => {
                  const firstName = item.profileId?.basicDetails?.firstName ?? ''
                  const lastName = item.profileId?.basicDetails?.lastName ?? ''
                  const fullName = `${firstName} ${lastName}`.trim()

                  return (
                    <tr key={item._id}>
                      <td className="text-center">
                        <input type="checkbox" className="form-check-input" />
                      </td>

                      <td className="text-nowrap">{index + 1}</td>

                      <td className="text-nowrap">
                        <span className="fw-medium">{item.profileId?.matrimonyId ?? '-'}</span>
                      </td>

                      {/* USER WITH AVATAR */}
                      <td className="text-nowrap">
                        <div className="d-flex align-items-center flex-nowrap gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 fw-semibold"
                            style={{
                              width: '38px',
                              height: '38px',
                              background: '#EEF4FF',
                              color: '#4C6FFF',
                              fontSize: '13px',
                            }}>
                            {getInitials(firstName, lastName) || '?'}
                          </div>

                          <div className="text-nowrap">
                            <div className="fw-semibold text-dark">{fullName || 'Unknown member'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-nowrap">{renderStars(item.rating)}</td>
                      <td className="text-nowrap">{item.review}</td>

                      <td className="text-nowrap">
                        {' '}
                        <button
                          type="button"
                          className="btn btn-soft-danger btn-sm"
                          title="Delete Review"
                          disabled={deletingId === item._id}
                          onClick={() => handleDelete(item._id)}>
                          {' '}
                          {deletingId === item._id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                          )}{' '}
                        </button>{' '}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

export default AppReview
