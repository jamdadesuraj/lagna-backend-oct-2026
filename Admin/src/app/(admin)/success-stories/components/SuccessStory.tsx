'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Modal, Button, Form, Spinner } from 'react-bootstrap'

import {
  useGetSuccessStoriesQuery,
  useCreateSuccessStoryMutation,
  useUpdateSuccessStoryMutation,
  useDeleteSuccessStoryMutation,
  type SuccessStory as SuccessStoryType,
} from '../../../../../store/successStoryApi'

type ModalMode = 'add' | 'edit' | null

const toDateInputValue = (isoDate: string) => {
  // "2026-01-01T00:00:00.000Z" -> "2026-01-01" for <input type="date">
  if (!isoDate) return ''
  return isoDate.slice(0, 10)
}

const SuccessStory = () => {
  const { data: storiesRes, isLoading, isError } = useGetSuccessStoriesQuery({ page: 1, limit: 50 })
  const [createStory, { isLoading: isCreating }] = useCreateSuccessStoryMutation()
  const [updateStory, { isLoading: isUpdating }] = useUpdateSuccessStoryMutation()
  const [deleteStory] = useDeleteSuccessStoryMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingStory, setEditingStory] = useState<SuccessStoryType | null>(null)

  const [groomName, setGroomName] = useState('')
  const [brideName, setBrideName] = useState('')
  const [badge, setBadge] = useState('New')
  const [marriedDate, setMarriedDate] = useState('')
  const [location, setLocation] = useState('')
  const [story, setStory] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [isActive, setIsActive] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const allData = useMemo(() => storiesRes?.data ?? [], [storiesRes])
  const isSaving = isCreating || isUpdating

  // ---------------- reset / prefill form ----------------
  const resetForm = () => {
    setGroomName('')
    setBrideName('')
    setBadge('New')
    setMarriedDate('')
    setLocation('')
    setStory('')
    setYear(String(new Date().getFullYear()))
    setIsActive(true)
    setImage(null)
    setImagePreview(null)
  }

  const openAdd = () => {
    resetForm()
    setEditingStory(null)
    setModalMode('add')
  }

  const openEdit = (item: SuccessStoryType) => {
    setGroomName(item.groomName)
    setBrideName(item.brideName)
    setBadge(item.badge)
    setMarriedDate(toDateInputValue(item.marriedDate))
    setLocation(item.location)
    setStory(item.story)
    setYear(String(item.year))
    setIsActive(item.isActive)
    setImage(null)
    setImagePreview(item.image)
    setEditingStory(item)
    setModalMode('edit')
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingStory(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  // ---------------- submit (add + edit share this) ----------------
  const handleSubmit = async () => {
    if (!groomName.trim() || !brideName.trim() || !marriedDate || !location.trim() || !story.trim()) {
      alert('Groom name, bride name, married date, location and description are required')
      return
    }
    if (modalMode === 'add' && !image) {
      alert('Image is required')
      return
    }

    try {
      if (modalMode === 'add') {
        await createStory({
          groomName,
          brideName,
          badge,
          marriedDate,
          location,
          story,
          year: Number(year) || new Date().getFullYear(),
          image: image as File,
          isActive,
        }).unwrap()
      } else if (modalMode === 'edit' && editingStory) {
        await updateStory({
          id: editingStory._id,
          groomName,
          brideName,
          badge,
          marriedDate,
          location,
          story,
          year: Number(year) || new Date().getFullYear(),
          image, // null if unchanged — backend keeps existing image
          isActive,
        }).unwrap()
      }
      closeModal()
    } catch {
      alert(`Failed to ${modalMode === 'add' ? 'create' : 'update'}. Please try again.`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this success story?')) return
    try {
      setDeletingId(id)
      await deleteStory(id).unwrap()
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
            Success Stories
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
                  <th className="text-nowrap">Year</th>
                  <th className="text-nowrap">Image</th>
                  <th className="text-nowrap">Badge</th>
                  <th className="text-nowrap">Couple Name</th>
                  <th className="text-nowrap">Married Date</th>
                  <th className="text-nowrap">Location</th>
                  <th className="text-nowrap">Description</th>
                  <th className="text-nowrap">Status</th>
                  <th className="text-nowrap">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={10} className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={10} className="text-center text-danger py-3">
                      Failed to load data.
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && allData.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-3">
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
                      <td className="text-nowrap">{item.year}</td>
                      <td className="text-nowrap">
                        <img
                          src={item.image}
                          alt={`${item.groomName} & ${item.brideName}`}
                          width={40}
                          height={40}
                          style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </td>
                      <td>
                        <span className="badge bg-success-subtle text-success">{item.badge}</span>
                      </td>
                      <td className="text-nowrap">
                        {item.groomName} & {item.brideName}
                      </td>
                      <td className="text-nowrap">{toDateInputValue(item.marriedDate)}</td>
                      <td className="text-nowrap">{item.location}</td>
                      <td className="text-truncate" style={{ maxWidth: 200 }}>
                        {item.story}
                      </td>
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
          <Modal.Title>{modalMode === 'edit' ? 'Edit' : 'Add'} Success Story</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Form.Group className="mb-3 col-6">
              <Form.Label>Groom Name</Form.Label>
              <Form.Control value={groomName} onChange={(e) => setGroomName(e.target.value)} placeholder="e.g. Arun" />
            </Form.Group>

            <Form.Group className="mb-3 col-6">
              <Form.Label>Bride Name</Form.Label>
              <Form.Control value={brideName} onChange={(e) => setBrideName(e.target.value)} placeholder="e.g. Priya" />
            </Form.Group>
          </div>

          <div className="row">
            <Form.Group className="mb-3 col-6">
              <Form.Label>Badge</Form.Label>
              <Form.Control value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. New" />
            </Form.Group>

            <Form.Group className="mb-3 col-6">
              <Form.Label>Year</Form.Label>
              <Form.Control type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            </Form.Group>
          </div>

          <div className="row">
            <Form.Group className="mb-3 col-6">
              <Form.Label>Married Date</Form.Label>
              <Form.Control type="date" value={marriedDate} onChange={(e) => setMarriedDate(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3 col-6">
              <Form.Label>Location</Form.Label>
              <Form.Control value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Pune" />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={story} onChange={(e) => setStory(e.target.value)} placeholder="Their story..." />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
            )}
          </Form.Group>

          <Form.Check type="switch" id="success-story-active" label="Active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
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

export default SuccessStory
