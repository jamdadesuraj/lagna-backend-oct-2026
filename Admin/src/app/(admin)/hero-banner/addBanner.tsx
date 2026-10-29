'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateHeroBannerMutation } from '../../../../store/heroBanerApi'

const AddHeroBannerModal = ({ onClose }: { onClose: () => void }) => {
  const [createHeroBanner, { isLoading }] = useCreateHeroBannerMutation()

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [badge, setBadge] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [isActive, setIsActive] = useState(true)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async () => {
    if (!image) {
      alert('Image is required')
      return
    }
    if (!badge.trim() || !title.trim() || !description.trim()) {
      alert('Badge, title and description are required')
      return
    }
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('badge', badge)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('displayOrder', displayOrder)
      formData.append('isActive', String(isActive))

      await createHeroBanner(formData).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Hero Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="img-fluid rounded mt-2" style={{ maxHeight: 150 }} />}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Badge</Form.Label>
          <Form.Control type="text" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="India's Most Trusted Matrimony Service" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Every Love Story Begins With Trust" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Join millions of members who found their perfect life partner"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Display Order</Form.Label>
          <Form.Control type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Check type="switch" id="hero-banner-active" label="Active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
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

export default AddHeroBannerModal
