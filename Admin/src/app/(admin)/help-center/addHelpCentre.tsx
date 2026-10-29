'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateHelpCenterMutation } from '../../../../store/helpCentreApi'

const AddHelpCenterModal = ({ onClose }: { onClose: () => void }) => {
  const [createHelpCenter, { isLoading }] = useCreateHelpCenterMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [displayOrder, setDisplayOrder] = useState('1')
  const [isActive, setIsActive] = useState(true)

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setIcon(file)
    setIconPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !icon) {
      alert('Title, description and icon are required')
      return
    }
    try {
      await createHelpCenter({
        title,
        description,
        icon,
        displayOrder: Number(displayOrder) || 0,
        isActive,
      }).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Help Center</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Profile & Account" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Help related to profile and account."
          />
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
          <Form.Check type="switch" id="help-center-active" label="Active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddHelpCenterModal
