/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useState, useMemo } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Spinner, Modal, CardBody } from 'react-bootstrap'

import { useGetPackagesQuery, useGetPackageByIdQuery, useDeletePackageMutation } from '../../../../store/packageApi'

import AddPackageModal from './addPackage'
import EditPackageModal from './editPackage'

const PAGE_SIZE = 5

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

// ==================================================
// VIEW MODAL
// ==================================================
const ViewPackageModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetPackageByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View Package</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Title</th>
                <td>{data.data.title}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{data.data.description}</td>
              </tr>
              <tr>
                <th>Duration</th>
                <td>
                  {data.data.duration} {data.data.durationType}
                </td>
              </tr>
              <tr>
                <th>Price</th>
                <td>
                  ₹{data.data.price}{' '}
                  {data.data.originalPrice > data.data.price && (
                    <span className="text-muted text-decoration-line-through ms-1">₹{data.data.originalPrice}</span>
                  )}
                </td>
              </tr>
              <tr>
                <th>Discount</th>
                <td>{data.data.discountPercentage}%</td>
              </tr>
              <tr>
                <th>Badge</th>
                <td>{data.data.badge || '-'}</td>
              </tr>
              <tr>
                <th>Features</th>
                <td>
                  <ul className="mb-0 ps-3">
                    {data.data.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <th>Display Order</th>
                <td>{data.data.displayOrder}</td>
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
// PACKAGE TABLE (fully wired, paginated)
// ==================================================
const PackageTable = () => {
  const { data: packageRes, isLoading, isError } = useGetPackagesQuery()
  const [deletePackage] = useDeletePackageMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const allData = packageRes?.data ?? []
  const totalPages = Math.max(1, Math.ceil(allData.length / PAGE_SIZE))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return allData.slice(start, start + PAGE_SIZE)
  }, [allData, currentPage])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return
    try {
      setDeletingId(id)
      await deletePackage(id).unwrap()
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center gap-1">
          <CardTitle as={'h4'} className="flex-grow-1">
            Membership Packages
          </CardTitle>
          <button className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
            <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" /> Add Package
          </button>
        </CardHeader>
        <CardBody>
          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered table-bordered">
              <thead className="bg-light-subtle">
                <tr>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Badge</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colSpan={7} className="text-center text-danger py-3">
                      Failed to load data.
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-3">
                      No records found.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !isError &&
                  paginatedData.map((item) => (
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td>
                        {item.duration} {item.durationType}
                      </td>
                      <td>₹{item.price}</td>
                      <td>{item.discountPercentage}%</td>
                      <td>{item.badge || '-'}</td>
                      <td>
                        <span className={`badge ${item.isDeleted ? 'bg-secondary' : 'bg-success'}`}>{item.isDeleted ? 'Inactive' : 'Active'}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-soft-info btn-sm" onClick={() => setViewingId(item._id)}>
                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                          </button>
                          <button className="btn btn-soft-primary btn-sm" onClick={() => setEditingId(item._id)}>
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </button>
                          <button className="btn btn-soft-danger btn-sm" disabled={deletingId === item._id} onClick={() => handleDelete(item._id)}>
                            {deletingId === item._id ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </CardBody>
      </Card>

      {viewingId && <ViewPackageModal id={viewingId} onClose={() => setViewingId(null)} />}
      {editingId && <EditPackageModal id={editingId} onClose={() => setEditingId(null)} />}
      {isAdding && <AddPackageModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

export default PackageTable
