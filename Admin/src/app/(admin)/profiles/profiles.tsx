/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Spinner } from 'react-bootstrap'

import { useDeleteProfileMutation, useGetProfilesQuery } from '../../../../store/profilesApi'

import AddProfileModal from './addProfile'
import EditProfileModal from './editProfile'
import ViewProfileModal from './viewProfile'

const PAGE_SIZE = 10

// When searching, we don't have a backend search endpoint yet,
// so we fetch a much larger batch and filter it in memory.
const SEARCH_FETCH_LIMIT = 1000

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
      <nav aria-label="Profile pagination">
        <ul className="pagination justify-content-end mb-0">
          {/* Previous */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button type="button" className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>

          {/* Pages */}
          {pages.map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button type="button" className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          ))}

          {/* Next */}
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
// PROFILE TABLE
// ==================================================
const ProfileTable = () => {
  // ==================================================
  // STATES
  // ==================================================
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const [viewingId, setViewingId] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)

  const [isAdding, setIsAdding] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  // Search
  const [searchTerm, setSearchTerm] = useState('')

  const selectAllRef = useRef<HTMLInputElement | null>(null)

  const isSearching = searchTerm.trim().length > 0

  // ==================================================
  // FETCH DATA
  // While searching: pull a large batch once and filter client-side.
  // While browsing: ask the backend for exactly the page we need.
  // ==================================================
  const {
    data: profileRes,
    isLoading,
    isError,
  } = useGetProfilesQuery({
    page: isSearching ? 1 : currentPage,
    limit: isSearching ? SEARCH_FETCH_LIMIT : PAGE_SIZE,
  })

  const [deleteProfile] = useDeleteProfileMutation()

  // ==================================================
  // ALL DATA (whatever batch was fetched for the current mode)
  // ==================================================
  const allData = profileRes?.data ?? []

  // ==================================================
  // SEARCH FILTER (applied only to the fetched batch)
  // ==================================================
  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
      return allData
    }

    return allData.filter((item) => {
      const matrimonyId = item.matrimonyId?.toString().toLowerCase() ?? ''

      const firstName = item.basicDetails?.firstName?.toString().toLowerCase() ?? ''

      const lastName = item.basicDetails?.lastName?.toString().toLowerCase() ?? ''

      const fullName = `${firstName} ${lastName}`.trim()

      const gender = item.basicDetails?.gender?.toString().toLowerCase() ?? ''

      const age = item.basicDetails?.age?.toString().toLowerCase() ?? ''

      const city = item.locationDetails?.city?.toString().toLowerCase() ?? ''

      const verificationStatus = item.isVerified ? 'verified' : 'unverified'

      const blockedStatus = item.isBlocked ? 'blocked' : 'active'

      return (
        matrimonyId.includes(search) ||
        firstName.includes(search) ||
        lastName.includes(search) ||
        fullName.includes(search) ||
        gender.includes(search) ||
        age.includes(search) ||
        city.includes(search) ||
        verificationStatus.includes(search) ||
        blockedStatus.includes(search)
      )
    })
  }, [allData, searchTerm])

  // ==================================================
  // TOTAL PAGES
  // - Searching: computed locally from the filtered batch.
  // - Browsing: taken from the backend's pagination meta.
  // ==================================================
  const totalPages = isSearching ? Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE)) : Math.max(1, profileRes?.pagination?.totalPages ?? 1)

  // ==================================================
  // PAGINATED DATA
  // - Searching: slice the filtered batch locally.
  // - Browsing: the backend already returned just this page.
  // ==================================================
  const paginatedData = useMemo(() => {
    if (!isSearching) {
      return filteredData
    }

    const start = (currentPage - 1) * PAGE_SIZE

    return filteredData.slice(start, start + PAGE_SIZE)
  }, [filteredData, currentPage, isSearching])

  // ==================================================
  // CURRENT PAGE IDS
  // ==================================================
  const currentPageIds = useMemo(() => paginatedData.map((item) => item._id), [paginatedData])

  // ==================================================
  // SELECT ALL STATE
  // ==================================================
  const isAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  const isSomeCurrentPageSelected = currentPageIds.some((id) => selectedIds.includes(id)) && !isAllCurrentPageSelected

  // ==================================================
  // SEARCH -> RESET PAGE
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
  // FIX CURRENT PAGE
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
    const existingIds = new Set(allData.map((item) => item._id))

    setSelectedIds((prev) => {
      const validIds = prev.filter((id) => existingIds.has(id))

      if (validIds.length === prev.length && validIds.every((id, index) => id === prev[index])) {
        return prev
      }

      return validIds
    })
  }, [allData])

  // ==================================================
  // SINGLE CHECKBOX
  // ==================================================
  const handleSelectProfile = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id)
      }

      return [...prev, id]
    })
  }

  // ==================================================
  // SELECT / UNSELECT CURRENT PAGE
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
  // SINGLE DELETE
  // ==================================================
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) {
      return
    }

    try {
      setDeletingId(id)

      await deleteProfile(id).unwrap()

      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    } catch (error) {
      console.error('Delete profile error:', error)

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

    const confirmed = confirm(`Are you sure you want to delete ${totalSelected} selected ${totalSelected === 1 ? 'profile' : 'profiles'}?`)

    if (!confirmed) return

    try {
      setIsBulkDeleting(true)

      const failedIds: string[] = []

      for (const id of selectedIds) {
        try {
          await deleteProfile(id).unwrap()
        } catch (error) {
          console.error(`Failed to delete profile ${id}:`, error)

          failedIds.push(id)
        }
      }

      // Failed records remain selected
      setSelectedIds(failedIds)

      if (failedIds.length > 0) {
        alert(`${totalSelected - failedIds.length} profile(s) deleted successfully. ${failedIds.length} profile(s) could not be deleted.`)
      }
    } catch (error) {
      console.error('Bulk delete error:', error)

      alert('Bulk delete failed. Please try again.')
    } finally {
      setIsBulkDeleting(false)
    }
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

  return (
    <>
      <Card>
        {/* ================= HEADER ================= */}
        <CardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          {/* LEFT */}
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <CardTitle as="h4" className="mb-0">
              Profile List
            </CardTitle>

            {selectedIds.length > 0 && <span className="badge bg-primary-subtle text-primary">{selectedIds.length} Selected</span>}
          </div>

          {/* RIGHT */}
          <div className="d-flex align-items-center flex-wrap gap-2">
            {/* ================= SEARCH ================= */}
            <div
              className="position-relative"
              style={{
                minWidth: '250px',
              }}>
              <input
                type="search"
                className="form-control form-control-sm pe-5"
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn border-0 p-0 position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
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

            {/* Add Profile */}
            <button type="button" className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
              <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" />
              Add Profile
            </button>
          </div>
        </CardHeader>

        {/* ================= TABLE ================= */}
        <CardBody>
          {/* Search Result Info */}
          {searchTerm && (
            <div className="d-flex align-items-center justify-content-between mb-3">
              <small className="text-muted">
                {filteredData.length} profile
                {filteredData.length !== 1 ? 's' : ''} found for &quot;
                {searchTerm}&quot;
              </small>

              <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none" onClick={handleClearSearch}>
                Clear Search
              </button>
            </div>
          )}

          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered table-bordered">
              <thead className="bg-light-subtle">
                <tr>
                  {/* Select All */}
                  <th
                    style={{
                      width: '45px',
                      textAlign: 'center',
                    }}>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className="form-check-input"
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAllCurrentPage}
                      disabled={paginatedData.length === 0 || isBulkDeleting}
                      aria-label="Select all profiles on this page"
                    />
                  </th>

                  <th>SR.No</th>
                  <th>Matrimony ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {isLoading && (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}

                {/* Error */}
                {isError && (
                  <tr>
                    <td colSpan={9} className="text-center text-danger py-4">
                      Failed to load data.
                    </td>
                  </tr>
                )}

                {/* Empty */}
                {!isLoading && !isError && paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-5">
                      {searchTerm ? (
                        <div>
                          <IconifyIcon icon="solar:magnifer-linear" className="fs-32 text-muted mb-2" />

                          <div className="fw-medium">No profiles found</div>

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

                {/* Rows */}
                {!isLoading &&
                  !isError &&
                  paginatedData.map((item, index) => {
                    const isSelected = selectedIds.includes(item._id)

                    return (
                      <tr key={item._id} className={isSelected ? 'table-active' : undefined}>
                        {/* Checkbox */}
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => handleSelectProfile(item._id)}
                            disabled={isBulkDeleting}
                            aria-label={`Select ${item.basicDetails?.firstName ?? 'profile'}`}
                          />
                        </td>

                        {/* SR Number */}
                        <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                        {/* Matrimony ID */}
                        <td>{item.matrimonyId || '-'}</td>

                        {/* Name */}
                        <td>
                          <div className="fw-medium">
                            {item.basicDetails?.firstName || ''} {item.basicDetails?.lastName || ''}
                          </div>
                        </td>

                        {/* Gender */}
                        <td>{item.basicDetails?.gender || '-'}</td>

                        {/* Age */}
                        <td>{item.basicDetails?.age || '-'}</td>

                        {/* City */}
                        <td>{item.locationDetails?.city || '-'}</td>

                        {/* Status */}
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            <span className={`badge ${item.isVerified ? 'bg-success' : 'bg-secondary'}`}>
                              {item.isVerified ? 'Verified' : 'Unverified'}
                            </span>

                            {item.isBlocked && <span className="badge bg-danger">Blocked</span>}
                          </div>
                        </td>

                        {/* Action */}
                        <td>
                          <div className="d-flex gap-2">
                            {/* View */}
                            <button
                              type="button"
                              className="btn btn-soft-info btn-sm"
                              onClick={() => setViewingId(item._id)}
                              disabled={isBulkDeleting}
                              title="View Profile">
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              className="btn btn-soft-primary btn-sm"
                              onClick={() => setEditingId(item._id)}
                              disabled={isBulkDeleting}
                              title="Edit Profile">
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="btn btn-soft-danger btn-sm"
                              disabled={deletingId === item._id || isBulkDeleting}
                              onClick={() => handleDelete(item._id)}
                              title="Delete Profile">
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
        </CardBody>

        {/* ================= PAGINATION ================= */}
        <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Card>

      {/* ================= MODALS ================= */}
      {viewingId && <ViewProfileModal id={viewingId} onClose={() => setViewingId(null)} />}

      {editingId && <EditProfileModal id={editingId} onClose={() => setEditingId(null)} />}

      {isAdding && <AddProfileModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

export default ProfileTable
