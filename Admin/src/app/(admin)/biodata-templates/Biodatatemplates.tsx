/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Form, Modal, Button, Spinner } from 'react-bootstrap'
import Image from 'next/image'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import {
  useCreateBiodataTemplateMutation,
  useDeleteBiodataTemplateMutation,
  useGetBiodataTemplatesQuery,
  useUpdateBiodataTemplateMutation,
  useUpdateBiodataTemplateStatusMutation,
  type BiodataTemplate,
  type BiodataTemplateStatus,
} from '../../../../store/biodataTemplateApi'

const PAGE_SIZE = 10

// Local form state shape shared by both Add & Edit modes
interface TemplateFormState {
  template: File | null
  preview: string | null
  title: string
  description: string
  price: string
  status: BiodataTemplateStatus
}

const emptyForm: TemplateFormState = {
  template: null,
  preview: null,
  title: '',
  description: '',
  price: '',
  status: 'active',
}

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
// SINGLE COMPONENT — LIST + ADD + EDIT + VIEW + DELETE + STATUS TOGGLE
// ==================================================
const BiodataTemplates = () => {
  // ---- list state (server-side pagination/search/status) ----
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'' | BiodataTemplateStatus>('')

  const {
    data: listRes,
    isLoading,
    isFetching,
    isError,
  } = useGetBiodataTemplatesQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: statusFilter || undefined,
  })

  const [createBiodataTemplate, { isLoading: isCreating }] = useCreateBiodataTemplateMutation()
  const [updateBiodataTemplate, { isLoading: isUpdating }] = useUpdateBiodataTemplateMutation()
  const [updateBiodataTemplateStatus, { isLoading: isTogglingStatus }] = useUpdateBiodataTemplateStatusMutation()
  const [deleteBiodataTemplate] = useDeleteBiodataTemplateMutation()

  // ---- modal / mode state ----
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | null>(null)
  const [selected, setSelected] = useState<BiodataTemplate | null>(null)
  const [form, setForm] = useState<TemplateFormState>(emptyForm)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const data = listRes?.data ?? []
  const total = listRes?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  // Reset to page 1 whenever the search or status filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const openAdd = () => {
    setForm(emptyForm)
    setSelected(null)
    setModalMode('add')
  }

  const openEdit = (item: BiodataTemplate) => {
    setForm({
      template: null,
      preview: item.template,
      title: item.title,
      description: item.description,
      price: String(item.price ?? ''),
      status: item.status,
    })
    setSelected(item)
    setModalMode('edit')
  }

  const openView = (item: BiodataTemplate) => {
    setSelected(item)
    setModalMode('view')
  }

  const closeModal = () => {
    setModalMode(null)
    setSelected(null)
    setForm(emptyForm)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setForm((prev) => ({
      ...prev,
      template: file,
      preview: file ? URL.createObjectURL(file) : prev.preview,
    }))
  }

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert('Title and description are required.')
      return
    }

    if (modalMode === 'add' && !form.template) {
      alert('Template image is required.')
      return
    }

    const priceValue = Number(form.price)
    if (form.price.trim() === '' || Number.isNaN(priceValue) || priceValue < 0) {
      alert('Please enter a valid price (0 or more).')
      return
    }

    try {
      const formData = new FormData()
      if (form.template) formData.append('template', form.template)
      formData.append('title', form.title)
      formData.append('description', form.description)
      // multipart/form-data only carries strings — backend coerces this
      // back to a number during validation.
      formData.append('price', String(priceValue))
      formData.append('status', form.status)

      if (modalMode === 'add') {
        await createBiodataTemplate(formData).unwrap()
      } else if (modalMode === 'edit' && selected) {
        await updateBiodataTemplate({ id: selected._id, formData }).unwrap()
      }

      closeModal()
    } catch {
      alert(`Failed to ${modalMode === 'add' ? 'create' : 'update'}. Please try again.`)
    }
  }

  const handleToggleStatus = async (item: BiodataTemplate) => {
    try {
      await updateBiodataTemplateStatus({
        id: item._id,
        status: item.status === 'active' ? 'inactive' : 'active',
      }).unwrap()
    } catch {
      alert('Failed to update status. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this biodata template?')) return
    try {
      setDeletingId(id)
      await deleteBiodataTemplate(id).unwrap()
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const isSaving = isCreating || isUpdating

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
          <CardTitle as={'h4'} className="flex-grow-1 mb-0">
            Biodata Template List
          </CardTitle>

          <Form.Control
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 220 }}
          />

          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as '' | BiodataTemplateStatus)} style={{ maxWidth: 160 }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>

          <button className="btn btn-sm btn-primary" onClick={openAdd}>
            <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" /> Add Template
          </button>
        </CardHeader>

        <CardBody>
          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered table-bordered">
              <thead className="bg-light-subtle">
                <tr>
                  <th>Sr.No</th>
                  <th>Template</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) && (
                  <tr>
                    <td colSpan={7} className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}
                {!isLoading && isError && (
                  <tr>
                    <td colSpan={7} className="text-center text-danger py-3">
                      Failed to load data.
                    </td>
                  </tr>
                )}
                {!isLoading && !isFetching && !isError && data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-3">
                      No records found.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !isFetching &&
                  !isError &&
                  data.map((item, index) => (
                    <tr key={item._id}>
                      <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td>
                        <Image
                          width={64}
                          height={40}
                          src={item.template}
                          alt={item.title}
                          style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 4 }}
                        />
                      </td>
                      <td>{item.title}</td>
                      <td className="text-truncate" style={{ maxWidth: 260 }}>
                        {item.description}
                      </td>
                      <td>{item.price > 0 ? `₹${item.price}` : 'Free'}</td>
                      <td>
                        <span
                          role="button"
                          className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-secondary'}`}
                          onClick={() => !isTogglingStatus && handleToggleStatus(item)}
                          title="Click to toggle status">
                          {item.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-soft-info btn-sm" onClick={() => openView(item)}>
                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                          </button>
                          <button className="btn btn-soft-primary btn-sm" onClick={() => openEdit(item)}>
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

      {/* ---------------- ADD / EDIT MODAL ---------------- */}
      <Modal show={modalMode === 'add' || modalMode === 'edit'} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Add Biodata Template' : 'Edit Biodata Template'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Template Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {form.preview && <img src={form.preview} alt="Preview" className="img-fluid rounded mt-2" style={{ maxHeight: 150 }} />}
            {modalMode === 'edit' && <Form.Text muted>Leave empty to keep the current image.</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Classic Elegant Template"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="A clean, elegant biodata template suitable for all religions."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="0 for a free template"
            />
            <Form.Text muted>Enter 0 to make this template free.</Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="switch"
              id="biodata-template-status"
              label="Active"
              checked={form.status === 'active'}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.checked ? 'active' : 'inactive' }))}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------- VIEW MODAL ---------------- */}
      <Modal show={modalMode === 'view'} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>View Biodata Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <Image width={64} height={40} src={selected.template} alt={selected.title} className="img-fluid rounded mb-3" />
              <table className="table table-bordered mb-0">
                <tbody>
                  <tr>
                    <th style={{ width: '35%' }}>Title</th>
                    <td>{selected.title}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>{selected.description}</td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td>{selected.price > 0 ? `₹${selected.price}` : 'Free'}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <span className={`badge ${selected.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {selected.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Created At</th>
                    <td>{new Date(selected.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Updated At</th>
                    <td>{new Date(selected.updatedAt).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default BiodataTemplates
