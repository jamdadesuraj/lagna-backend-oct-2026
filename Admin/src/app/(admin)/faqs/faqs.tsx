/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Modal, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { useDeleteFaqMutation, useGetFaqByIdQuery, useGetFaqsQuery } from '../../../../store/faqAPi'

import AddFaqModal from './addFaqs'
import EditFaqModal from './editFaqs'

const PAGE_SIZE = 10

// ==================================================
// HELPER: safely read category title (handles populated object or plain id)
// ==================================================
const getCategoryTitle = (helpCenterId: unknown): string => {
  if (helpCenterId && typeof helpCenterId === 'object' && 'title' in helpCenterId) {
    return (helpCenterId as { title: string }).title
  }
  return '-'
}

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
const ViewFaqModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetFaqByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View FAQ</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}

        {isError && <p className="text-danger mb-0">Failed to load details.</p>}

        {data && (
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Category</th>
                <td>{getCategoryTitle(data.data.helpCenterId)}</td>
              </tr>

              <tr>
                <th>Question</th>
                <td>{data.data.question}</td>
              </tr>

              <tr>
                <th>Answer</th>
                <td>{data.data.answer}</td>
              </tr>

              <tr>
                <th>Display Order</th>
                <td>{data.data.displayOrder}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>
                  <span className={`badge ${data.data.isActive ? 'bg-success' : 'bg-secondary'}`}>{data.data.isActive ? 'Active' : 'Inactive'}</span>
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
// FAQ TABLE
// ==================================================
const FaqTable = () => {
  const { data: faqRes, isLoading, isError } = useGetFaqsQuery()

  const [deleteFaq] = useDeleteFaqMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [viewingId, setViewingId] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)

  const [isAdding, setIsAdding] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  // ==================================================
  // BULK SELECT
  // ==================================================
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const selectAllRef = useRef<HTMLInputElement | null>(null)

  // ==================================================
  // DATA
  // ==================================================
  const allData = faqRes?.data ?? []

  const totalPages = Math.max(1, Math.ceil(allData.length / PAGE_SIZE))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE

    return allData.slice(start, start + PAGE_SIZE)
  }, [allData, currentPage])

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
  // SINGLE DELETE
  // ==================================================
  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this FAQ?')

    if (!confirmed) return

    try {
      setDeletingId(id)

      await deleteFaq(id).unwrap()

      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))

      toast.success('FAQ deleted successfully.')
    } catch (error) {
      console.error('FAQ delete error:', error)

      toast.error('Failed to delete FAQ.')
    } finally {
      setDeletingId(null)
    }
  }

  // ==================================================
  // BULK DELETE
  // ==================================================
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one FAQ.')

      return
    }

    const totalSelected = selectedIds.length

    const confirmed = confirm(`Are you sure you want to delete ${totalSelected} selected FAQ${totalSelected > 1 ? 's' : ''}?`)

    if (!confirmed) return

    try {
      setIsBulkDeleting(true)

      let successCount = 0
      const failedIds: string[] = []

      for (const id of selectedIds) {
        try {
          await deleteFaq(id).unwrap()
          successCount++
        } catch (error) {
          console.error(`Failed to delete FAQ: ${id}`, error)

          failedIds.push(id)
        }
      }

      // Only failed IDs remain selected
      setSelectedIds(failedIds)

      if (failedIds.length === 0) {
        toast.success(`${successCount} FAQ${successCount > 1 ? 's' : ''} deleted successfully.`)
      } else if (successCount > 0) {
        toast.warning(`${successCount} FAQ${successCount > 1 ? 's' : ''} deleted successfully. ${failedIds.length} failed.`)
      } else {
        toast.error('Failed to delete selected FAQs.')
      }
    } catch (error) {
      console.error('FAQ bulk delete error:', error)

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
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <CardTitle as="h4" className="mb-0">
              FAQ List
            </CardTitle>

            {/* Selected Count */}
            {selectedIds.length > 0 && <span className="badge bg-primary-subtle text-primary">{selectedIds.length} Selected</span>}
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Clear Selection */}
            {selectedIds.length > 0 && (
              <button type="button" className="btn btn-sm btn-light" onClick={handleClearSelection} disabled={isBulkDeleting}>
                <IconifyIcon icon="solar:close-circle-broken" className="me-1 fs-16" />
                Clear
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

            {/* Add FAQ */}
            <button type="button" className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
              <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" />
              Add FAQ
            </button>
          </div>
        </CardHeader>

        <CardBody>
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
                      aria-label="Select all FAQs"
                    />
                  </th>

                  <th>Sr.No</th>
                  <th>Category</th>
                  <th>Question</th>
                  <th>Display Order</th>
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
                    <td colSpan={7} className="text-center py-3">
                      No records found.
                    </td>
                  </tr>
                )}

                {/* DATA */}
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
                            aria-label={`Select FAQ ${item.question}`}
                          />
                        </td>

                        {/* SR NO */}
                        <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                        {/* Category */}
                        <td>{getCategoryTitle(item.helpCenterId)}</td>

                        {/* Question */}
                        <td>{item.question || '-'}</td>

                        {/* Display Order */}
                        <td>{item.displayOrder ?? '-'}</td>

                        {/* Status */}
                        <td>
                          <span className={`badge ${item.isActive ? 'bg-success' : 'bg-secondary'}`}>{item.isActive ? 'Active' : 'Inactive'}</span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="d-flex gap-2">
                            {/* View */}
                            <button
                              type="button"
                              className="btn btn-soft-info btn-sm"
                              onClick={() => setViewingId(item._id)}
                              disabled={isBulkDeleting}
                              title="View FAQ">
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              className="btn btn-soft-primary btn-sm"
                              onClick={() => setEditingId(item._id)}
                              disabled={isBulkDeleting}
                              title="Edit FAQ">
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="btn btn-soft-danger btn-sm"
                              disabled={deletingId === item._id || isBulkDeleting}
                              onClick={() => handleDelete(item._id)}
                              title="Delete FAQ">
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
      {viewingId && <ViewFaqModal id={viewingId} onClose={() => setViewingId(null)} />}

      {editingId && <EditFaqModal id={editingId} onClose={() => setEditingId(null)} />}

      {isAdding && <AddFaqModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

export default FaqTable
