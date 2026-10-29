'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetHeroBannerByIdQuery, useUpdateHeroBannerMutation } from '../../../../store/heroBanerApi'

const EditHeroBannerModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetHeroBannerByIdQuery(id)
  const [updateHeroBanner, { isLoading: isUpdating }] = useUpdateHeroBannerMutation()

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [badge, setBadge] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (data?.data) {
      setBadge(data.data.badge)
      setTitle(data.data.title)
      setDescription(data.data.description)
      setDisplayOrder(String(data.data.displayOrder))
      setIsActive(data.data.isActive)
      setPreview(data.data.image)
    }
  }, [data])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!badge.trim() || !title.trim() || !description.trim()) {
      alert('Badge, title and description are required')
      return
    }
    try {
      const formData = new FormData()
      // only send a new image if the user picked one; otherwise the existing one is kept
      if (image) formData.append('image', image)
      formData.append('badge', badge)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('displayOrder', displayOrder)
      formData.append('isActive', String(isActive))

      await updateHeroBanner({ id, formData }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Hero Banner</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              {preview && <img src={preview} alt="Preview" className="img-fluid rounded mt-2" style={{ maxHeight: 150 }} />}
              <Form.Text muted>Leave empty to keep the current image.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Badge</Form.Label>
              <Form.Control type="text" value={badge} onChange={(e) => setBadge(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Order</Form.Label>
              <Form.Control type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="switch"
                id="hero-banner-active-edit"
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

export default EditHeroBannerModal
