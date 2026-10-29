/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Spinner } from 'react-bootstrap'

import { useDeleteProfileVerificationMutation, useGetProfileVerificationsQuery } from '../../../../store/profileVerificationApi'

import ReviewVerificationModal from './viewVerification'

const PAGE_SIZE = 10

// ==================================================
// PAGINATION FOOTER
// ==================================================
const PaginationFooter = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <CardFooter className="border-top">
      <nav aria-label="Profile verification pagination">
        <ul className="pagination justify-content-end mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button type="button" className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>

          {pages.map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button type="button" className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button type="button" className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </CardFooter>
  )
}

// ==================================================
// PROFILE VERIFICATION TABLE
// ==================================================
const ProfileVerificationTable = () => {
  const { data: verificationRes, isLoading, isError } = useGetProfileVerificationsQuery()

  const [deleteProfileVerification] = useDeleteProfileVerificationMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [reviewingId, setReviewingId] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)

  // ==================================================
  // SEARCH
  // ==================================================
  const [searchTerm, setSearchTerm] = useState('')

  // ==================================================
  // BULK SELECTION
  // ==================================================
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const selectAllRef = useRef<HTMLInputElement | null>(null)

  // ==================================================
  // ALL DATA
  // ==================================================
  const allData = verificationRes?.data ?? []

  // ==================================================
  // SEARCH FILTER
  // ==================================================
  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
      return allData
    }

    return allData.filter((item) => {
      const matrimonyId = item.profileId?.matrimonyId?.toString().toLowerCase() ?? ''

      const profileId = item.profileId?._id?.toString().toLowerCase() ?? ''

      const status = item.status?.toString().toLowerCase() ?? ''

      const rejectionReason = item.rejectionReason?.toString().toLowerCase() ?? ''

      const createdDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''

      const createdDateText = createdDate.toLowerCase()

      return (
        matrimonyId.includes(search) ||
        profileId.includes(search) ||
        status.includes(search) ||
        rejectionReason.includes(search) ||
        createdDateText.includes(search)
      )
    })
  }, [allData, searchTerm])

  // ==================================================
  // TOTAL PAGES
  // ==================================================
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))

  // ==================================================
  // PAGINATED DATA
  // ==================================================
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE

    return filteredData.slice(start, start + PAGE_SIZE)
  }, [filteredData, currentPage])

  // ==================================================
  // CURRENT PAGE IDS
  // ==================================================
  const currentPageIds = useMemo(() => paginatedData.map((item) => item._id), [paginatedData])

  // ==================================================
  // SELECT ALL STATES
  // ==================================================
  const isAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  const isSomeCurrentPageSelected = currentPageIds.some((id) => selectedIds.includes(id)) && !isAllCurrentPageSelected

  // ==================================================
  // RESET PAGE ON SEARCH
  // ==================================================
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // ==================================================
  // INDETERMINATE CHECKBOX
  // ==================================================
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeCurrentPageSelected
    }
  }, [isSomeCurrentPageSelected])

  // ==================================================
  // FIX PAGE AFTER DELETE
  // ==================================================
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // ==================================================
  // REMOVE INVALID SELECTED IDS
  // ==================================================
  useEffect(() => {
    const validIds = new Set(allData.map((item) => item._id))

    setSelectedIds((prev) => {
      const filtered = prev.filter((id) => validIds.has(id))

      if (filtered.length === prev.length && filtered.every((id, index) => id === prev[index])) {
        return prev
      }

      return filtered
    })
  }, [allData])

  // ==================================================
  // SINGLE CHECKBOX
  // ==================================================
  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id)
      }

      return [...prev, id]
    })
  }

  // ==================================================
  // SELECT ALL CURRENT PAGE
  // ==================================================
  const handleSelectAllCurrentPage = () => {
    setSelectedIds((prev) => {
      if (isAllCurrentPageSelected) {
        return prev.filter((id) => !currentPageIds.includes(id))
      }

      return Array.from(new Set([...prev, ...currentPageIds]))
    })
  }

  // ==================================================
  // CLEAR SELECTION
  // ==================================================
  const handleClearSelection = () => {
    setSelectedIds([])
  }

  // ==================================================
  // CLEAR SEARCH
  // ==================================================
  const handleClearSearch = () => {
    setSearchTerm('')
  }

  // ==================================================
  // SINGLE DELETE
  // ==================================================
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this verification request?')) {
      return
    }

    try {
      setDeletingId(id)

      await deleteProfileVerification(id).unwrap()

      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    } catch (error) {
      console.error('Delete verification request error:', error)

      alert('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  // ==================================================
  // BULK DELETE
  // ==================================================
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      return
    }

    const totalSelected = selectedIds.length

    const confirmed = confirm(
      `Are you sure you want to delete ${totalSelected} selected verification ${totalSelected === 1 ? 'request' : 'requests'}?`,
    )

    if (!confirmed) return

    try {
      setIsBulkDeleting(true)

      const failedIds: string[] = []

      for (const id of selectedIds) {
        try {
          await deleteProfileVerification(id).unwrap()
        } catch (error) {
          console.error(`Failed to delete verification ${id}:`, error)

          failedIds.push(id)
        }
      }

      // Keep failed IDs selected
      setSelectedIds(failedIds)

      if (failedIds.length > 0) {
        const successCount = totalSelected - failedIds.length

        alert(`${successCount} request(s) deleted successfully. ${failedIds.length} request(s) could not be deleted.`)
      }
    } catch (error) {
      console.error('Bulk delete error:', error)

      alert('Failed to delete selected requests. Please try again.')
    } finally {
      setIsBulkDeleting(false)
    }
  }

  return (
    <>
      <Card>
        {/* ================= HEADER ================= */}
        <CardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          {/* LEFT */}
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <CardTitle as="h4" className="mb-0">
              Profile Verification Requests
            </CardTitle>

            {selectedIds.length > 0 && <span className="badge bg-primary-subtle text-primary">{selectedIds.length} Selected</span>}
          </div>

          {/* RIGHT */}
          <div className="d-flex align-items-center flex-wrap gap-2">
            {/* ================= SEARCH ================= */}
            <div
              className="position-relative"
              style={{
                minWidth: '260px',
              }}>
              <input
                type="search"
                className="form-control form-control-sm pe-5"
                placeholder="Search verification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm ? (
                <button
                  type="button"
                  className="btn border-0 p-0 position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                  onClick={handleClearSearch}
                  aria-label="Clear search">
                  <IconifyIcon icon="solar:close-circle-linear" className="fs-18" />
                </button>
              ) : (
                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted fs-18" />
              )}
            </div>

            {/* Clear Selection */}
            {selectedIds.length > 0 && (
              <button type="button" className="btn btn-sm btn-light" onClick={handleClearSelection} disabled={isBulkDeleting}>
                Clear Selection
              </button>
            )}

            {/* Bulk Delete */}
            {selectedIds.length > 0 && (
              <button type="button" className="btn btn-sm btn-danger" onClick={handleBulkDelete} disabled={isBulkDeleting}>
                {isBulkDeleting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-1" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1 fs-16" />
                    Delete Selected ({selectedIds.length})
                  </>
                )}
              </button>
            )}
          </div>
        </CardHeader>

        <CardBody>
          {/* ================= SEARCH RESULT INFO ================= */}
          {searchTerm && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <small className="text-muted">
                {filteredData.length} verification request
                {filteredData.length !== 1 ? 's' : ''} found for &quot;
                {searchTerm}&quot;
              </small>

              <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none" onClick={handleClearSearch}>
                Clear Search
              </button>
            </div>
          )}

          {/* ================= TABLE ================= */}
          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered table-bordered">
              <thead className="bg-light-subtle">
                <tr>
                  {/* Select All */}
                  <th
                    className="text-center"
                    style={{
                      width: '45px',
                    }}>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className="form-check-input"
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAllCurrentPage}
                      disabled={paginatedData.length === 0 || isBulkDeleting}
                      aria-label="Select all verification requests on this page"
                    />
                  </th>

                  <th>Profile ID</th>
                  <th>Status</th>
                  <th>Rejection Reason</th>
                  <th>Requested On</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}

                {/* Error */}
                {isError && (
                  <tr>
                    <td colSpan={6} className="text-center text-danger py-3">
                      Failed to load data.
                    </td>
                  </tr>
                )}

                {/* Empty / Search Empty */}
                {!isLoading && !isError && paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      {searchTerm ? (
                        <div>
                          <IconifyIcon icon="solar:magnifer-linear" className="fs-32 text-muted mb-2" />

                          <div className="fw-medium">No verification requests found</div>

                          <small className="text-muted">
                            No results found for &quot;
                            {searchTerm}
                            &quot;
                          </small>

                          <div className="mt-2">
                            <button type="button" className="btn btn-sm btn-light" onClick={handleClearSearch}>
                              Clear Search
                            </button>
                          </div>
                        </div>
                      ) : (
                        'No records found.'
                      )}
                    </td>
                  </tr>
                )}

                {/* Data */}
                {!isLoading &&
                  !isError &&
                  paginatedData.map((item) => {
                    const isSelected = selectedIds.includes(item._id)

                    return (
                      <tr key={item._id} className={isSelected ? 'table-active' : undefined}>
                        {/* Checkbox */}
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => handleSelect(item._id)}
                            disabled={isBulkDeleting}
                            aria-label={`Select verification ${item.profileId?.matrimonyId || item._id}`}
                          />
                        </td>

                        {/* Profile ID */}
                        <td>{item.profileId?.matrimonyId || item.profileId?._id || '-'}</td>

                        {/* Status */}
                        <td>
                          <span
                            className={`badge ${
                              item.status === 'approved' ? 'bg-success' : item.status === 'rejected' ? 'bg-danger' : 'bg-warning'
                            }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Rejection Reason */}
                        <td>{item.rejectionReason || '-'}</td>

                        {/* Requested Date */}
                        <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>

                        {/* Actions */}
                        <td>
                          <div className="d-flex gap-2">
                            {/* Review */}
                            <button
                              type="button"
                              className="btn btn-soft-primary btn-sm"
                              onClick={() => setReviewingId(item._id)}
                              disabled={isBulkDeleting}
                              title="Review Verification">
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="btn btn-soft-danger btn-sm"
                              disabled={deletingId === item._id || isBulkDeleting}
                              onClick={() => handleDelete(item._id)}
                              title="Delete Verification">
                              {deletingId === item._id ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </CardBody>
      </Card>

      {/* ================= REVIEW MODAL ================= */}
      {reviewingId && <ReviewVerificationModal id={reviewingId} onClose={() => setReviewingId(null)} />}
    </>
  )
}

export default ProfileVerificationTable
