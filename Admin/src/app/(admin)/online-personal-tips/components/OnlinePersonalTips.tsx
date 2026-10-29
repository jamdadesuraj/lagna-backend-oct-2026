'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Modal, Button, Form, Spinner } from 'react-bootstrap'

import {
  useGetOnlinePersonalTipsQuery,
  useCreateOnlinePersonalTipMutation,
  useUpdateOnlinePersonalTipMutation,
  useDeleteOnlinePersonalTipMutation,
  PERSONAL_TIP_CATEGORIES,
  type OnlinePersonalTip,
  type PersonalTipCategory,
} from '../../../../../store/onlinePersonalTipsApi'

type ModalMode = 'add' | 'edit' | null

const OnlinePersonalTips = () => {
  const { data: tipsRes, isLoading, isError } = useGetOnlinePersonalTipsQuery()
  const [createTip, { isLoading: isCreating }] = useCreateOnlinePersonalTipMutation()
  const [updateTip, { isLoading: isUpdating }] = useUpdateOnlinePersonalTipMutation()
  const [deleteTip] = useDeleteOnlinePersonalTipMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingTip, setEditingTip] = useState<OnlinePersonalTip | null>(null)

  const [category, setCategory] = useState<PersonalTipCategory>(PERSONAL_TIP_CATEGORIES[0])
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [isActive, setIsActive] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const allData = useMemo(() => tipsRes?.data ?? [], [tipsRes])
  const isSaving = isCreating || isUpdating

  // ---------------- reset / prefill form ----------------
  const resetForm = () => {
    setCategory(PERSONAL_TIP_CATEGORIES[0])
    setTitle('')
    setSubTitle('')
    setDisplayOrder('1')
    setIsActive(true)
    setImage(null)
    setImagePreview(null)
  }

  const openAdd = () => {
    resetForm()
    setEditingTip(null)
    setModalMode('add')
  }

  const openEdit = (tip: OnlinePersonalTip) => {
    setCategory(tip.category)
    setTitle(tip.title)
    setSubTitle(tip.subTitle)
    setDisplayOrder(String(tip.displayOrder))
    setIsActive(tip.isActive)
    setImage(null)
    setImagePreview(tip.image)
    setEditingTip(tip)
    setModalMode('edit')
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingTip(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  // ---------------- submit (add + edit share this) ----------------
  const handleSubmit = async () => {
    if (!title.trim() || !subTitle.trim()) {
      alert('Title and sub-title are required')
      return
    }
    if (modalMode === 'add' && !image) {
      alert('Image is required')
      return
    }

    try {
      if (modalMode === 'add') {
        await createTip({
          category,
          image: image as File,
          title,
          subTitle,
          displayOrder: Number(displayOrder) || 1,
          isActive,
        }).unwrap()
      } else if (modalMode === 'edit' && editingTip) {
        await updateTip({
          id: editingTip._id,
          category,
          image, // null if unchanged — backend keeps existing image
          title,
          subTitle,
          displayOrder: Number(displayOrder) || 1,
          isActive,
        }).unwrap()
      }
      closeModal()
    } catch {
      alert(`Failed to ${modalMode === 'add' ? 'create' : 'update'}. Please try again.`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tip?')) return
    try {
      setDeletingId(id)
      await deleteTip(id).unwrap()
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        {/* ================= HEADER ================= */}
        <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
          <CardTitle as="h4" className="mb-0">
            Online Personal Tips
          </CardTitle>

          <button type="button" className="btn btn-sm btn-primary text-nowrap" onClick={openAdd}>
            <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" />
            Add
          </button>
        </CardHeader>

        {/* ================= TABLE ================= */}
        <CardBody>
          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered table-bordered" style={{ minWidth: '1150px' }}>
              <thead className="bg-light-subtle">
                <tr>
                  <th className="text-center text-nowrap" style={{ width: '45px' }}>
                    <input type="checkbox" className="form-check-input" aria-label="Select all" />
                  </th>
                  <th className="text-nowrap">SR.No</th>
                  <th className="text-nowrap">Category</th>
                  <th className="text-nowrap">Image</th>
                  <th className="text-nowrap">Title</th>
                  <th className="text-nowrap">Sub-Title</th>
                  <th className="text-nowrap">Status</th>
                  <th className="text-nowrap">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={8} className="text-center text-danger py-3">
                      Failed to load data.
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && allData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-3">
                      No records found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  allData.map((item, index) => (
                    <tr key={item._id}>
                      <td className="text-center">
                        <input type="checkbox" className="form-check-input" />
                      </td>
                      <td className="text-nowrap">{index + 1}</td>
                      <td className="text-nowrap">{item.category}</td>
                      <td className="text-nowrap">
                        <img src={item.image} alt={item.title} width={40} height={40} style={{ objectFit: 'cover', borderRadius: '50%' }} />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.subTitle}</td>
                      <td className="text-nowrap">
                        <span className={`badge ${item.isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-soft-primary btn-sm" title="Edit" onClick={() => openEdit(item)}>
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-soft-danger btn-sm"
                            title="Delete"
                            disabled={deletingId === item._id}
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
                  ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* ================= ADD / EDIT MODAL (shared) ================= */}
      <Modal show={modalMode !== null} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'edit' ? 'Edit' : 'Add'} Online Personal Tip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value as PersonalTipCategory)}>
              {PERSONAL_TIP_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Keep your profile updated" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sub-Title</Form.Label>
            <Form.Control value={subTitle} onChange={(e) => setSubTitle(e.target.value)} placeholder="e.g. Fresh profiles get more responses" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Display Order</Form.Label>
            <Form.Control type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
          </Form.Group>

          <Form.Check
            type="switch"
            id="online-personal-tip-active"
            label="Active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
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
    </>
  )
}

export default OnlinePersonalTips
