'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Spinner } from 'react-bootstrap'

import { useGetSubscribedMembersQuery } from '../../../../../../store/paymentsApi'

const PAGE_SIZE = 10

const formatDate = (value?: string | null) => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatValidity = (duration?: number | null, durationType?: 'DAY' | 'MONTH' | 'YEAR' | null) => {
  if (!duration || !durationType) return '-'

  const unit = durationType.charAt(0) + durationType.slice(1).toLowerCase()

  return `${duration} ${unit}${duration > 1 ? 's' : ''}`
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
// SUBSCRIBED MEMBER LIST
// ==================================================
const SubscribedMember = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Debounce search and go back to page 1 when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
      setCurrentPage(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const {
    data: membersRes,
    isLoading,
    isError,
  } = useGetSubscribedMembersQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
  })

  const members = membersRes?.data ?? []
  const totalPages = membersRes?.pagination?.totalPages ?? 1

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase()
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
        <CardTitle as="h4" className="mb-0">
          Subscribed Member List
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
                <th className="text-nowrap">Package Name</th>
                <th className="text-nowrap">Package Price</th>
                <th className="text-nowrap">Start Date</th>
                <th className="text-nowrap">End Date</th>
                <th className="text-nowrap">Validity</th>
                <th className="text-nowrap">Status</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {isLoading && (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading subscribed members...
                  </td>
                </tr>
              )}

              {/* ERROR */}
              {!isLoading && isError && (
                <tr>
                  <td colSpan={10} className="text-center text-danger py-4">
                    Failed to load subscribed members.
                  </td>
                </tr>
              )}

              {/* EMPTY */}
              {!isLoading && !isError && members.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center text-muted py-4">
                    {debouncedSearch ? 'No members match your search.' : 'No subscribed members found.'}
                  </td>
                </tr>
              )}

              {/* ROWS */}
              {!isLoading &&
                !isError &&
                members.map((item, index) => {
                  const fullName = `${item.firstName} ${item.lastName}`.trim()
                  const isActive = item.status === 'ACTIVE'

                  return (
                    <tr key={item._id}>
                      <td className="text-center">
                        <input type="checkbox" className="form-check-input" />
                      </td>

                      <td className="text-nowrap">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                      <td className="text-nowrap">
                        <span className="fw-medium">{item.matrimonyId ?? '-'}</span>
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
                            {getInitials(item.firstName, item.lastName) || '?'}
                          </div>

                          <div className="text-nowrap">
                            <div className="fw-semibold text-dark">{fullName || 'Unknown member'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="text-nowrap">
                        {item.packageName ? <span className="badge bg-warning-subtle text-warning px-2 py-1">{item.packageName}</span> : '-'}
                      </td>

                      <td className="text-nowrap fw-semibold">
                        {item.price !== null && item.price !== undefined ? `₹${item.price.toLocaleString('en-IN')}` : '-'}
                      </td>

                      <td className="text-nowrap">{formatDate(item.startDate)}</td>

                      <td className="text-nowrap">{formatDate(item.expiryDate)}</td>

                      <td className="text-nowrap">
                        {item.duration && item.durationType ? (
                          <span className="badge bg-primary-subtle text-primary">{formatValidity(item.duration, item.durationType)}</span>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="text-nowrap">
                        {isActive ? (
                          <span className="badge bg-success-subtle text-success">Active</span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger">Expired</span>
                        )}
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
  )
}

export default SubscribedMember
