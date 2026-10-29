/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Modal, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { useDeleteQualificationMutation, useGetQualificationByIdQuery, useGetQualificationsQuery } from '../../../../store/qualificationApi'

import AddQualificationModal from './addQualification'
import EditQualificationModal from './editQualification'

const PAGE_SIZE = 5

// ==================================================
// PAGINATION
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
      <nav aria-label="Page navigation">
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
// VIEW MODAL
// ==================================================
const ViewQualificationModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetQualificationByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View Qualification</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}

        {isError && <p className="text-danger mb-0">Failed to load details.</p>}

        {data && (
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Qualification</th>
                <td>{data.data.qualification}</td>
              </tr>

              <tr>
                <th>Education Type</th>
                <td>{data.data.educationType}</td>
              </tr>

              <tr>
                <th>Occupation</th>
                <td>{data.data.occupation}</td>
              </tr>

              <tr>
                <th>Status</th>

                <td>
                  <span className={`badge ${data.data.isDeleted ? 'bg-secondary' : 'bg-success'}`}>
                    {data.data.isDeleted ? 'Inactive' : 'Active'}
                  </span>
                </td>
              </tr>

              <tr>
                <th>Created At</th>
                <td>{new Date(data.data.createdAt).toLocaleString()}</td>
              </tr>

              <tr>
                <th>Updated At</th>
                <td>{new Date(data.data.updatedAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Modal.Body>
    </Modal>
  )
}

// ==================================================
// QUALIFICATION TABLE
// ==================================================
const QualificationTable = () => {
  const { data: qualificationRes, isLoading, isError } = useGetQualificationsQuery()

  const [deleteQualification] = useDeleteQualificationMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [viewingId, setViewingId] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)

  const [isAdding, setIsAdding] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  // ==================================================
  // SEARCH
  // ==================================================
  const [searchTerm, setSearchTerm] = useState('')

  // ==================================================
  // MULTI SELECT STATES
  // ==================================================
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const selectAllRef = useRef<HTMLInputElement | null>(null)

  // ==================================================
  // DATA
  // ==================================================
  const allData = qualificationRes?.data ?? []

  // ==================================================
  // FILTERED DATA
  // ==================================================
  const filteredData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
      return allData
    }

    return allData.filter((item) => {
      const qualification = item.qualification?.toString().toLowerCase() ?? ''

      const educationType = item.educationType?.toString().toLowerCase() ?? ''

      const occupation = item.occupation?.toString().toLowerCase() ?? ''

      const status = item.isDeleted ? 'inactive' : 'active'

      return qualification.includes(search) || educationType.includes(search) || occupation.includes(search) || status.includes(search)
    })
  }, [allData, searchTerm])

  // ==================================================
  // PAGINATION
  // ==================================================
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))

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
  // RESET PAGE WHEN SEARCH CHANGES
  // ==================================================
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // ==================================================
  // INDETERMINATE
  // ==================================================
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeCurrentPageSelected
    }
  }, [isSomeCurrentPageSelected])

  // ==================================================
  // FIX CURRENT PAGE AFTER DELETE
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
    const confirmed = confirm('Are you sure you want to delete this qualification?')

    if (!confirmed) return

    try {
      setDeletingId(id)

      await deleteQualification(id).unwrap()

      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))

      toast.success('Qualification deleted successfully.')
    } catch (error) {
      console.error('Qualification delete error:', error)

      toast.error('Failed to delete qualification.')
    } finally {
      setDeletingId(null)
    }
  }

  // ==================================================
  // BULK DELETE
  // ==================================================
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one qualification.')
      return
    }

    const totalSelected = selectedIds.length

    const confirmed = confirm(`Are you sure you want to delete ${totalSelected} selected qualification${totalSelected > 1 ? 's' : ''}?`)

    if (!confirmed) return

    try {
      setIsBulkDeleting(true)

      let successCount = 0
      const failedIds: string[] = []

      for (const id of selectedIds) {
        try {
          await deleteQualification(id).unwrap()

          successCount++
        } catch (error) {
          console.error(`Qualification delete failed: ${id}`, error)

          failedIds.push(id)
        }
      }

      setSelectedIds(failedIds)

      if (failedIds.length === 0) {
        toast.success(`${successCount} qualification${successCount > 1 ? 's' : ''} deleted successfully.`)
      } else if (successCount > 0) {
        toast.warning(`${successCount} qualification${successCount > 1 ? 's' : ''} deleted. ${failedIds.length} failed.`)
      } else {
        toast.error('Failed to delete selected qualifications.')
      }
    } catch (error) {
      console.error('Bulk qualification delete error:', error)

      toast.error('Bulk delete failed. Please try again.')
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
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <CardTitle as="h4" className="mb-0 text-nowrap">
              Qualification List
            </CardTitle>

            {selectedIds.length > 0 && <span className="badge bg-primary-subtle text-primary text-nowrap">{selectedIds.length} Selected</span>}
          </div>

          {/* RIGHT */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* CLEAR */}
            {selectedIds.length > 0 && (
              <button type="button" className="btn btn-sm btn-light text-nowrap" onClick={handleClearSelection} disabled={isBulkDeleting}>
                <IconifyIcon icon="solar:close-circle-broken" className="me-1 fs-16" />
                Clear
              </button>
            )}

            {/* BULK DELETE */}
            {selectedIds.length > 0 && (
              <button type="button" className="btn btn-sm btn-danger text-nowrap" onClick={handleBulkDelete} disabled={isBulkDeleting}>
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

            {/* ================= SEARCH ================= */}
            <div
              className="position-relative"
              style={{
                width: '260px',
                flex: '0 0 260px',
              }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search qualification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  height: '34px',
                  paddingLeft: '40px',
                  paddingRight: searchTerm ? '40px' : '12px',
                }}
              />

              {searchTerm && (
                <button
                  type="button"
                  className="position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent p-0 text-muted"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  style={{
                    zIndex: 6,
                    lineHeight: 1,
                  }}>
                  <IconifyIcon icon="solar:close-circle-linear" className="fs-18" />
                </button>
              )}
            </div>

            {/* ADD */}
            <button type="button" className="btn btn-sm btn-primary text-nowrap" onClick={() => setIsAdding(true)}>
              <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" />
              Add Qualification
            </button>
          </div>
        </CardHeader>

        <CardBody>
          {/* Search Result */}
          {searchTerm && (
            <div className="mb-2">
              <small className="text-muted">
                {filteredData.length} result
                {filteredData.length !== 1 ? 's' : ''} found
              </small>
            </div>
          )}

          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered table-bordered">
              <thead className="bg-light-subtle">
                <tr>
                  {/* Select All */}
                  <th className="text-center" style={{ width: 45 }}>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className="form-check-input"
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAllCurrentPage}
                      disabled={paginatedData.length === 0 || isBulkDeleting}
                      aria-label="Select all qualifications"
                    />
                  </th>

                  <th>Sr.No</th>
                  <th>Qualification</th>
                  <th>Education Type</th>
                  <th>Occupation</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}

                {/* Error */}
                {isError && (
                  <tr>
                    <td colSpan={7} className="text-center text-danger py-3">
                      Failed to load data.
                    </td>
                  </tr>
                )}

                {/* Empty */}
                {!isLoading && !isError && paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      {searchTerm ? `No qualification found for "${searchTerm}".` : 'No records found.'}
                    </td>
                  </tr>
                )}

                {/* Data */}
                {!isLoading &&
                  !isError &&
                  paginatedData.map((item, index) => {
                    const isSelected = selectedIds.includes(item._id)

                    return (
                      <tr key={item._id} className={isSelected ? 'table-active' : ''}>
                        {/* Checkbox */}
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => handleSelect(item._id)}
                            disabled={isBulkDeleting}
                            aria-label={`Select ${item.qualification}`}
                          />
                        </td>

                        {/* Serial */}
                        <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                        <td>{item.qualification || '-'}</td>

                        <td>{item.educationType || '-'}</td>

                        <td>{item.occupation || '-'}</td>

                        <td>
                          <span className={`badge ${item.isDeleted ? 'bg-secondary' : 'bg-success'}`}>{item.isDeleted ? 'Inactive' : 'Active'}</span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            {/* View */}
                            <button
                              type="button"
                              className="btn btn-soft-info btn-sm"
                              onClick={() => setViewingId(item._id)}
                              disabled={isBulkDeleting}
                              title="View Qualification">
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              className="btn btn-soft-primary btn-sm"
                              onClick={() => setEditingId(item._id)}
                              disabled={isBulkDeleting}
                              title="Edit Qualification">
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="btn btn-soft-danger btn-sm"
                              disabled={deletingId === item._id || isBulkDeleting}
                              onClick={() => handleDelete(item._id)}
                              title="Delete Qualification">
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

          <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </CardBody>
      </Card>

      {/* ================= MODALS ================= */}
      {viewingId && <ViewQualificationModal id={viewingId} onClose={() => setViewingId(null)} />}

      {editingId && <EditQualificationModal id={editingId} onClose={() => setEditingId(null)} />}

      {isAdding && <AddQualificationModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

export default QualificationTable
