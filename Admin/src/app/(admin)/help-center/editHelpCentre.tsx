'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetHelpCenterByIdQuery, useUpdateHelpCenterMutation } from '../../../../store/helpCentreApi'

const EditHelpCenterModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetHelpCenterByIdQuery(id)
  const [updateHelpCenter, { isLoading: isUpdating }] = useUpdateHelpCenterMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [displayOrder, setDisplayOrder] = useState('1')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title)
      setDescription(data.data.description)
      setIconPreview(data.data.icon) // existing Cloudinary URL, shown until a new file is picked
      setDisplayOrder(String(data.data.displayOrder))
      setIsActive(data.data.isActive)
    }
  }, [data])

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setIcon(file)
    if (file) setIconPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required')
      return
    }
    try {
      await updateHelpCenter({
        id,
        title,
        description,
        icon, // null if unchanged — backend keeps existing icon when no file is sent
        displayOrder: Number(displayOrder) || 0,
        isActive,
      }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Help Center</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Icon</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleIconChange} />
              {iconPreview && (
                <img src={iconPreview} alt="Icon preview" style={{ width: 48, height: 48, objectFit: 'cover', marginTop: 8, borderRadius: 6 }} />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Order</Form.Label>
              <Form.Control type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="switch"
                id="help-center-active-edit"
                label="Active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isUpdating || isLoading}>
          {isUpdating ? <Spinner animation="border" size="sm" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditHelpCenterModal
