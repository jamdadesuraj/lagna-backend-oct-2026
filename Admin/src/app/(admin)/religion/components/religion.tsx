/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Col, Row, Spinner, Modal } from 'react-bootstrap'

import { useGetReligionsQuery, useGetReligionByIdQuery, useDeleteReligionMutation } from '../../../../../store/religionApi'

import { useGetCastesQuery, useGetCasteByIdQuery, useDeleteCasteMutation } from '../../../../../store/casteApi'

import { useGetSubCastesQuery, useGetSubCasteByIdQuery, useDeleteSubCasteMutation } from '../../../../../store/subCasteApi'

import AddReligionModal from './AddReligionModal'
import EditReligionModal from './EditReligionModal'
import AddCasteModal from './AddCasteModal'
import EditCasteModal from './EditCasteModal'
import AddSubCasteModal from './AddSubCasteModal'
import EditSubCasteModal from './EditSubCasteModal'

const PAGE_SIZE = 10

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
// INLINE VIEW MODAL — RELIGION
// ==================================================
const ViewReligionModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetReligionByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View Religion</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}

        {isError && <p className="text-danger mb-0">Failed to load details.</p>}

        {data && (
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Religion</th>
                <td>{data.data.religion}</td>
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
// INLINE VIEW MODAL — CASTE
// ==================================================
const ViewCasteModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetCasteByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View Caste</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}

        {isError && <p className="text-danger mb-0">Failed to load details.</p>}

        {data && (
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Religion</th>
                <td>{data.data.religionId?.religion}</td>
              </tr>

              <tr>
                <th>Caste</th>
                <td>{data.data.caste}</td>
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
// INLINE VIEW MODAL — SUB-CASTE
// ==================================================
const ViewSubCasteModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetSubCasteByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View Sub-Caste</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}

        {isError && <p className="text-danger mb-0">Failed to load details.</p>}

        {data && (
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Religion</th>
                <td>{data.data.religionId?.religion}</td>
              </tr>

              <tr>
                <th>Caste</th>
                <td>{data.data.casteId?.caste}</td>
              </tr>

              <tr>
                <th>Sub-Caste</th>
                <td>{data.data.subCaste}</td>
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
// 1. RELIGION TABLE
// ==================================================
const ReligionTable = () => {
  const { data: religionRes, isLoading, isError } = useGetReligionsQuery()

  const [deleteReligion] = useDeleteReligionMutation()

  const [search, setSearch] = useState('')

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [viewingId, setViewingId] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)

  const [isAdding, setIsAdding] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const selectAllRef = useRef<HTMLInputElement | null>(null)

  const allData = religionRes?.data ?? []

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return allData
    return allData.filter((item) => item.religion?.toLowerCase().includes(term))
  }, [allData, search])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE

    return filteredData.slice(start, start + PAGE_SIZE)
  }, [filteredData, currentPage])

  const currentPageIds = useMemo(() => paginatedData.map((item) => item._id), [paginatedData])

  const isAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  const isSomeCurrentPageSelected = currentPageIds.some((id) => selectedIds.includes(id)) && !isAllCurrentPageSelected

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeCurrentPageSelected
    }
  }, [isSomeCurrentPageSelected])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]))
  }

  const handleSelectAllCurrentPage = () => {
    setSelectedIds((prev) => {
      if (isAllCurrentPageSelected) {
        return prev.filter((id) => !currentPageIds.includes(id))
      }

      return Array.from(new Set([...prev, ...currentPageIds]))
    })
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this religion?')) {
      return
    }

    try {
      setDeletingId(id)

      await deleteReligion(id).unwrap()

      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return

    const totalSelected = selectedIds.length

    if (!confirm(`Are you sure you want to delete ${totalSelected} selected religion${totalSelected > 1 ? 's' : ''}?`)) {
      return
    }

    setIsBulkDeleting(true)

    const failedIds: string[] = []

    for (const id of selectedIds) {
      try {
        await deleteReligion(id).unwrap()
      } catch {
        failedIds.push(id)
      }
    }

    setSelectedIds(failedIds)
    setIsBulkDeleting(false)

    if (failedIds.length > 0) {
      alert(`${totalSelected - failedIds.length} deleted successfully. ${failedIds.length} failed.`)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <CardTitle as="h4" className="mb-0">
              Religion List
            </CardTitle>

            {selectedIds.length > 0 && <span className="badge bg-primary-subtle text-primary">{selectedIds.length} Selected</span>}
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {selectedIds.length > 0 && (
              <>
                <button type="button" className="btn btn-sm btn-light" onClick={handleClearSelection} disabled={isBulkDeleting}>
                  Clear
                </button>

                <button type="button" className="btn btn-sm btn-danger" onClick={handleBulkDelete} disabled={isBulkDeleting}>
                  {isBulkDeleting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-1" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                      Delete ({selectedIds.length})
                    </>
                  )}
                </button>
              </>
            )}

            <div style={{ width: '220px' }}>
              <div className="search-box position-relative">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search religion..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                />
                <i className="ri-search-line position-absolute top-50 end-0 translate-middle-y me-2 text-muted" />
              </div>
            </div>

            <button type="button" className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
              <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" /> Add Religion
            </button>
          </div>
        </CardHeader>

        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered table-bordered">
            <thead className="bg-light-subtle">
              <tr>
                <th className="text-center" style={{ width: 45 }}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="form-check-input"
                    checked={isAllCurrentPageSelected}
                    onChange={handleSelectAllCurrentPage}
                    disabled={!paginatedData.length || isBulkDeleting}
                  />
                </th>

                <th>Sr.No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={4} className="text-center text-danger py-3">
                    Failed to load data.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && paginatedData.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                paginatedData.map((item, index) => {
                  const isSelected = selectedIds.includes(item._id)

                  return (
                    <tr key={item._id} className={isSelected ? 'table-active' : undefined}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isSelected}
                          onChange={() => handleSelect(item._id)}
                          disabled={isBulkDeleting}
                        />
                      </td>

                      <td>{index + 1}</td>
                      <td>{item.religion}</td>

                      <td>
                        <span className={`badge ${item.isDeleted ? 'bg-secondary' : 'bg-success'}`}>{item.isDeleted ? 'Inactive' : 'Active'}</span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-soft-info btn-sm" onClick={() => setViewingId(item._id)}>
                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                          </button>

                          <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => setEditingId(item._id)}>
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </button>

                          <button
                            type="button"
                            className="btn btn-soft-danger btn-sm"
                            disabled={deletingId === item._id || isBulkDeleting}
                            onClick={() => handleDelete(item._id)}>
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
      </Card>

      {viewingId && <ViewReligionModal id={viewingId} onClose={() => setViewingId(null)} />}

      {editingId && <EditReligionModal id={editingId} onClose={() => setEditingId(null)} />}

      {isAdding && <AddReligionModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

// ==================================================
// 2. CASTE TABLE
// ==================================================
const CasteTable = () => {
  const { data: casteRes, isLoading, isError } = useGetCastesQuery()

  const [deleteCaste] = useDeleteCasteMutation()

  const [search, setSearch] = useState('')

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [viewingId, setViewingId] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)

  const [isAdding, setIsAdding] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const selectAllRef = useRef<HTMLInputElement | null>(null)

  const allData = casteRes?.data ?? []

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return allData
    return allData.filter((item) => item.caste?.toLowerCase().includes(term) || item.religionId?.religion?.toLowerCase().includes(term))
  }, [allData, search])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE

    return filteredData.slice(start, start + PAGE_SIZE)
  }, [filteredData, currentPage])

  const currentPageIds = useMemo(() => paginatedData.map((item) => item._id), [paginatedData])

  const isAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  const isSomeCurrentPageSelected = currentPageIds.some((id) => selectedIds.includes(id)) && !isAllCurrentPageSelected

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeCurrentPageSelected
    }
  }, [isSomeCurrentPageSelected])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]))
  }

  const handleSelectAllCurrentPage = () => {
    setSelectedIds((prev) => {
      if (isAllCurrentPageSelected) {
        return prev.filter((id) => !currentPageIds.includes(id))
      }

      return Array.from(new Set([...prev, ...currentPageIds]))
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this caste?')) {
      return
    }

    try {
      setDeletingId(id)

      await deleteCaste(id).unwrap()

      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return

    const totalSelected = selectedIds.length

    if (!confirm(`Are you sure you want to delete ${totalSelected} selected caste${totalSelected > 1 ? 's' : ''}?`)) {
      return
    }

    setIsBulkDeleting(true)

    const failedIds: string[] = []

    for (const id of selectedIds) {
      try {
        await deleteCaste(id).unwrap()
      } catch {
        failedIds.push(id)
      }
    }

    setSelectedIds(failedIds)
    setIsBulkDeleting(false)

    if (failedIds.length > 0) {
      alert(`${totalSelected - failedIds.length} deleted successfully. ${failedIds.length} failed.`)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <CardTitle as="h4" className="mb-0">
              Caste List
            </CardTitle>

            {selectedIds.length > 0 && <span className="badge bg-primary-subtle text-primary">{selectedIds.length} Selected</span>}
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {selectedIds.length > 0 && (
              <>
                <button type="button" className="btn btn-sm btn-light" onClick={() => setSelectedIds([])} disabled={isBulkDeleting}>
                  Clear
                </button>

                <button type="button" className="btn btn-sm btn-danger" onClick={handleBulkDelete} disabled={isBulkDeleting}>
                  {isBulkDeleting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-1" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                      Delete ({selectedIds.length})
                    </>
                  )}
                </button>
              </>
            )}

            <div style={{ width: '220px' }}>
              <div className="search-box position-relative">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search caste..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                />
                <i className="ri-search-line position-absolute top-50 end-0 translate-middle-y me-2 text-muted" />
              </div>
            </div>

            <button type="button" className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
              <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" /> Add Caste
            </button>
          </div>
        </CardHeader>

        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered table-bordered">
            <thead className="bg-light-subtle">
              <tr>
                <th className="text-center" style={{ width: 45 }}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="form-check-input"
                    checked={isAllCurrentPageSelected}
                    onChange={handleSelectAllCurrentPage}
                    disabled={!paginatedData.length || isBulkDeleting}
                  />
                </th>

                <th>Sr.No</th>
                <th>Religion</th>
                <th>Caste</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={5} className="text-center text-danger py-3">
                    Failed to load data.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && paginatedData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                paginatedData.map((item, index) => {
                  const isSelected = selectedIds.includes(item._id)

                  return (
                    <tr key={item._id} className={isSelected ? 'table-active' : undefined}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isSelected}
                          onChange={() => handleSelect(item._id)}
                          disabled={isBulkDeleting}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{item.religionId?.religion || '-'}</td>

                      <td>{item.caste}</td>

                      <td>
                        <span className={`badge ${item.isDeleted ? 'bg-secondary' : 'bg-success'}`}>{item.isDeleted ? 'Inactive' : 'Active'}</span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-soft-info btn-sm" onClick={() => setViewingId(item._id)}>
                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                          </button>

                          <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => setEditingId(item._id)}>
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </button>

                          <button
                            type="button"
                            className="btn btn-soft-danger btn-sm"
                            disabled={deletingId === item._id || isBulkDeleting}
                            onClick={() => handleDelete(item._id)}>
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
      </Card>

      {viewingId && <ViewCasteModal id={viewingId} onClose={() => setViewingId(null)} />}

      {editingId && <EditCasteModal id={editingId} onClose={() => setEditingId(null)} />}

      {isAdding && <AddCasteModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

// ==================================================
// 3. SUB-CASTE TABLE
// ==================================================
const SubCasteTable = () => {
  const { data: subCasteRes, isLoading, isError } = useGetSubCastesQuery()

  const [deleteSubCaste] = useDeleteSubCasteMutation()

  const [search, setSearch] = useState('')

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [viewingId, setViewingId] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)

  const [isAdding, setIsAdding] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const selectAllRef = useRef<HTMLInputElement | null>(null)

  const allData = subCasteRes?.data ?? []

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return allData
    return allData.filter(
      (item) =>
        item.subCaste?.toLowerCase().includes(term) ||
        item.casteId?.caste?.toLowerCase().includes(term) ||
        item.religionId?.religion?.toLowerCase().includes(term),
    )
  }, [allData, search])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE

    return filteredData.slice(start, start + PAGE_SIZE)
  }, [filteredData, currentPage])

  const currentPageIds = useMemo(() => paginatedData.map((item) => item._id), [paginatedData])

  const isAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id))

  const isSomeCurrentPageSelected = currentPageIds.some((id) => selectedIds.includes(id)) && !isAllCurrentPageSelected

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeCurrentPageSelected
    }
  }, [isSomeCurrentPageSelected])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]))
  }

  const handleSelectAllCurrentPage = () => {
    setSelectedIds((prev) => {
      if (isAllCurrentPageSelected) {
        return prev.filter((id) => !currentPageIds.includes(id))
      }

      return Array.from(new Set([...prev, ...currentPageIds]))
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sub-caste?')) {
      return
    }

    try {
      setDeletingId(id)

      await deleteSubCaste(id).unwrap()

      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return

    const totalSelected = selectedIds.length

    if (!confirm(`Are you sure you want to delete ${totalSelected} selected sub-caste${totalSelected > 1 ? 's' : ''}?`)) {
      return
    }

    setIsBulkDeleting(true)

    const failedIds: string[] = []

    for (const id of selectedIds) {
      try {
        await deleteSubCaste(id).unwrap()
      } catch {
        failedIds.push(id)
      }
    }

    setSelectedIds(failedIds)
    setIsBulkDeleting(false)

    if (failedIds.length > 0) {
      alert(`${totalSelected - failedIds.length} deleted successfully. ${failedIds.length} failed.`)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <CardTitle as="h4" className="mb-0">
              Sub-Caste List
            </CardTitle>

            {selectedIds.length > 0 && <span className="badge bg-primary-subtle text-primary">{selectedIds.length} Selected</span>}
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {selectedIds.length > 0 && (
              <>
                <button type="button" className="btn btn-sm btn-light" onClick={() => setSelectedIds([])} disabled={isBulkDeleting}>
                  Clear
                </button>

                <button type="button" className="btn btn-sm btn-danger" onClick={handleBulkDelete} disabled={isBulkDeleting}>
                  {isBulkDeleting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-1" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                      Delete ({selectedIds.length})
                    </>
                  )}
                </button>
              </>
            )}

            <div style={{ width: '220px' }}>
              <div className="search-box position-relative">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search sub-caste..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                />
                <i className="ri-search-line position-absolute top-50 end-0 translate-middle-y me-2 text-muted" />
              </div>
            </div>

            <button type="button" className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
              <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" /> Add Sub-Caste
            </button>
          </div>
        </CardHeader>

        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered table-bordered">
            <thead className="bg-light-subtle">
              <tr>
                <th className="text-center" style={{ width: 45 }}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="form-check-input"
                    checked={isAllCurrentPageSelected}
                    onChange={handleSelectAllCurrentPage}
                    disabled={!paginatedData.length || isBulkDeleting}
                  />
                </th>

                <th>Sr.No</th>
                <th>Religion</th>
                <th>Caste</th>
                <th>Sub-Caste</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={6} className="text-center text-danger py-3">
                    Failed to load data.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                paginatedData.map((item, index) => {
                  const isSelected = selectedIds.includes(item._id)

                  return (
                    <tr key={item._id} className={isSelected ? 'table-active' : undefined}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isSelected}
                          onChange={() => handleSelect(item._id)}
                          disabled={isBulkDeleting}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{item.religionId?.religion || '-'}</td>

                      <td>{item.casteId?.caste || '-'}</td>

                      <td>{item.subCaste}</td>

                      <td>
                        <span className={`badge ${item.isDeleted ? 'bg-secondary' : 'bg-success'}`}>{item.isDeleted ? 'Inactive' : 'Active'}</span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-soft-info btn-sm" onClick={() => setViewingId(item._id)}>
                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                          </button>

                          <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => setEditingId(item._id)}>
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </button>

                          <button
                            type="button"
                            className="btn btn-soft-danger btn-sm"
                            disabled={deletingId === item._id || isBulkDeleting}
                            onClick={() => handleDelete(item._id)}>
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
      </Card>

      {viewingId && <ViewSubCasteModal id={viewingId} onClose={() => setViewingId(null)} />}

      {editingId && <EditSubCasteModal id={editingId} onClose={() => setEditingId(null)} />}

      {isAdding && <AddSubCasteModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

// ==================================================
// MAIN PAGE
// ==================================================
const ReligionCasteSubCaste = () => {
  return (
    <Row>
      <Col lg={6}>
        <ReligionTable />
      </Col>

      <Col lg={6}>
        <CasteTable />
      </Col>

      <Col lg={12}>
        <SubCasteTable />
      </Col>
    </Row>
  )
}

export default ReligionCasteSubCaste
