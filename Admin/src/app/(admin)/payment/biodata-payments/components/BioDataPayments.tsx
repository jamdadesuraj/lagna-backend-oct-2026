'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Spinner } from 'react-bootstrap'
import { useGetBiodataPaymentsQuery } from '../../../../../../store/paymentsApi'

const PAGE_SIZE = 10

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase()
}

const formatDate = (value: string | null) => {
  if (!value) return '—'

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

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
    <CardFooter className="border-top bg-white">
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-end mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {pages.map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </CardFooter>
  )
}

const BioDataPayments = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  // Debounce the search box and go back to page 1 on a new search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
      setCurrentPage(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading, isFetching, isError } = useGetBiodataPaymentsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    search: search || undefined,
  })

  const payments = data?.data ?? []
  const totalPages = data?.pagination?.totalPages ?? 1

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
        <CardTitle as="h4" className="mb-0">
          Bio Data Payment List
        </CardTitle>

        <div style={{ width: '100%', maxWidth: '280px' }}>
          <div className="search-box position-relative">
            <input
              type="search"
              className="form-control"
              placeholder="Search member..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
                <th className="text-nowrap">Member Name</th>
                <th className="text-nowrap"> Price</th>
                <th className="text-nowrap">Created Date</th>
              </tr>
            </thead>

            <tbody>
              {(isLoading || isFetching) && (
                <tr>
                  <td colSpan={6} className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              )}

              {!isLoading && !isFetching && isError && (
                <tr>
                  <td colSpan={6} className="text-center text-danger py-3">
                    Failed to load data.
                  </td>
                </tr>
              )}

              {!isLoading && !isFetching && !isError && payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isFetching &&
                !isError &&
                payments.map((item, index) => {
                  const fullName = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim()

                  return (
                    <tr key={item._id}>
                      <td className="text-center">
                        <input type="checkbox" className="form-check-input" />
                      </td>

                      <td className="text-nowrap">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>

                      <td className="text-nowrap">
                        <span className="fw-medium">{item.matrimonyId ?? '—'}</span>
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
                            {getInitials(item.firstName, item.lastName) || '—'}
                          </div>

                          <div className="text-nowrap">
                            <div className="fw-semibold text-dark">{fullName || '—'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="text-nowrap fw-semibold">₹ {(item.price ?? 0).toLocaleString('en-IN')}</td>

                      <td className="text-nowrap">{formatDate(item.createdAt)}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </CardBody>

      <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </Card>
  )
}

export default BioDataPayments
