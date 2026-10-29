'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useState } from 'react'
import { Card, CardFooter, CardHeader, CardTitle, Col, Row, Spinner } from 'react-bootstrap'
import { useGetMotherTonguesQuery, useDeleteMotherTongueMutation } from '../../../../../store/motherToungeApi'
import { useGetQualificationsQuery, useDeleteQualificationMutation } from '../../../../../store/qualificationApi'
import AddMotherTongueModal from './addMotherTounge'
import EditMotherTongueModal from './editMotherTongue'
import ViewMotherTongueModal from './viewMotherTongue'
import AddQualificationModal from './AddQualificationModal'
import EditQualificationModal from './EditQualificationModal'
import ViewQualificationModal from './ViewQualificationModal'
import { useGetReligionsQuery, useDeleteReligionMutation } from '../../../../../store/religionApi'
import { useGetCastesQuery, useDeleteCasteMutation } from '../../../../../store/casteApi'
import { useGetSubCastesQuery, useDeleteSubCasteMutation } from '../../../../../store/subCasteApi'
import AddReligionModal from './AddReligionModal'
import AddCasteModal from './AddCasteModal'
import AddSubCasteModal from './AddSubCasteModal'

// ==================================================
// 1. RELIGION TABLE (fully wired)
// ==================================================
const ReligionTable = () => {
  const { data: religionRes, isLoading, isError } = useGetReligionsQuery()
  const [deleteReligion] = useDeleteReligionMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this religion?')) return
    try {
      setDeletingId(id)
      await deleteReligion(id).unwrap()
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
            Religion List
          </CardTitle>
          <button className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
            Add Religion
          </button>
        </CardHeader>
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle">
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={3} className="text-center text-danger py-3">
                    Failed to load data.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && religionRes?.data.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                religionRes?.data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.religion}</td>
                    <td>
                      <span className={`badge ${item.isDeleted ? 'bg-secondary' : 'bg-success'}`}>{item.isDeleted ? 'Inactive' : 'Active'}</span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link href="" className="btn btn-soft-primary btn-sm">
                          <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                        </Link>
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
        <CardFooter className="border-top">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mb-0">
              <li className="page-item">
                <Link className="page-link" href="">
                  Previous
                </Link>
              </li>
              <li className="page-item active">
                <Link className="page-link" href="">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </CardFooter>
      </Card>

      {isAdding && <AddReligionModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

// ==================================================
// 1B. CASTE TABLE (fully wired)
// ==================================================
const CasteTable = () => {
  const { data: casteRes, isLoading, isError } = useGetCastesQuery()
  const [deleteCaste] = useDeleteCasteMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this caste?')) return
    try {
      setDeletingId(id)
      await deleteCaste(id).unwrap()
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
            Caste List
          </CardTitle>
          <button className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
            Add Caste
          </button>
        </CardHeader>
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle">
              <tr>
                <th>Religion</th>
                <th>Caste</th>
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
              {!isLoading && !isError && casteRes?.data.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                casteRes?.data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.religionId?.religion}</td>
                    <td>{item.caste}</td>
                    <td>
                      <span className={`badge ${item.isDeleted ? 'bg-secondary' : 'bg-success'}`}>{item.isDeleted ? 'Inactive' : 'Active'}</span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link href="" className="btn btn-soft-primary btn-sm">
                          <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                        </Link>
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
        <CardFooter className="border-top">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mb-0">
              <li className="page-item">
                <Link className="page-link" href="">
                  Previous
                </Link>
              </li>
              <li className="page-item active">
                <Link className="page-link" href="">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </CardFooter>
      </Card>

      {isAdding && <AddCasteModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

// ==================================================
// 1C. SUB-CASTE TABLE (fully wired)
// ==================================================
const SubCasteTable = () => {
  const { data: subCasteRes, isLoading, isError } = useGetSubCastesQuery()
  const [deleteSubCaste] = useDeleteSubCasteMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sub-caste?')) return
    try {
      setDeletingId(id)
      await deleteSubCaste(id).unwrap()
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
            Sub-Caste List
          </CardTitle>
          <button className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
            Add Sub-Caste
          </button>
        </CardHeader>
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle">
              <tr>
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
              {!isLoading && !isError && subCasteRes?.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                subCasteRes?.data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.religionId?.religion}</td>
                    <td>{item.casteId?.caste}</td>
                    <td>{item.subCaste}</td>
                    <td>
                      <span className={`badge ${item.isDeleted ? 'bg-secondary' : 'bg-success'}`}>{item.isDeleted ? 'Inactive' : 'Active'}</span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link href="" className="btn btn-soft-primary btn-sm">
                          <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                        </Link>
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
        <CardFooter className="border-top">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mb-0">
              <li className="page-item">
                <Link className="page-link" href="">
                  Previous
                </Link>
              </li>
              <li className="page-item active">
                <Link className="page-link" href="">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </CardFooter>
      </Card>

      {isAdding && <AddSubCasteModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

// ==================================================
// 2. MOTHER TONGUE TABLE (fully wired) — unchanged
// ==================================================
const MotherTongueTable = () => {
  const { data: motherTongueRes, isLoading, isError } = useGetMotherTonguesQuery()
  const [deleteMotherTongue] = useDeleteMotherTongueMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mother tongue?')) return
    try {
      setDeletingId(id)
      await deleteMotherTongue(id).unwrap()
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
            Mother Tongue
          </CardTitle>
          <button className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
            Add Mother Tongue
          </button>
        </CardHeader>
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle">
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={3} className="text-center text-danger py-3">
                    Failed to load data.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && motherTongueRes?.data.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                motherTongueRes?.data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.motherTongue}</td>
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
        <CardFooter className="border-top">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mb-0">
              <li className="page-item">
                <Link className="page-link" href="">
                  Previous
                </Link>
              </li>
              <li className="page-item active">
                <Link className="page-link" href="">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </CardFooter>
      </Card>

      {viewingId && <ViewMotherTongueModal id={viewingId} onClose={() => setViewingId(null)} />}
      {editingId && <EditMotherTongueModal id={editingId} onClose={() => setEditingId(null)} />}
      {isAdding && <AddMotherTongueModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

// ==================================================
// 3. QUALIFICATION TABLE (fully wired) — unchanged
// ==================================================
const QualificationTable = () => {
  const { data: qualificationRes, isLoading, isError } = useGetQualificationsQuery()
  const [deleteQualification] = useDeleteQualificationMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this qualification?')) return
    try {
      setDeletingId(id)
      await deleteQualification(id).unwrap()
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
            Qualification
          </CardTitle>
          <button className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
            Add Qualification
          </button>
        </CardHeader>
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle">
              <tr>
                <th>Qualification</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={3} className="text-center text-danger py-3">
                    Failed to load data.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && qualificationRes?.data.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    No records found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                qualificationRes?.data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.qualification}</td>
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
        <CardFooter className="border-top">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mb-0">
              <li className="page-item">
                <Link className="page-link" href="">
                  Previous
                </Link>
              </li>
              <li className="page-item active">
                <Link className="page-link" href="">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" href="">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </CardFooter>
      </Card>

      {viewingId && <ViewQualificationModal id={viewingId} onClose={() => setViewingId(null)} />}
      {editingId && <EditQualificationModal id={editingId} onClose={() => setEditingId(null)} />}
      {isAdding && <AddQualificationModal onClose={() => setIsAdding(false)} />}
    </>
  )
}

// ==================================================
// MAIN PAGE
// ==================================================
const ProductList = () => {
  return (
    <Row>
      <Col lg={4}>
        <ReligionTable />
      </Col>
      <Col lg={4}>
        <MotherTongueTable />
      </Col>
      <Col lg={4}>
        <QualificationTable />
      </Col>
      <Col lg={6} className="mt-4">
        <CasteTable />
      </Col>
      <Col lg={6} className="mt-4">
        <SubCasteTable />
      </Col>
    </Row>
  )
}

export default ProductList
