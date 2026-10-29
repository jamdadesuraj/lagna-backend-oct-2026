'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useAddOnboardingItemMutation } from '../../../../../store/onboardingApi'

const AddOnboardingModal = ({ onClose }: { onClose: () => void }) => {
  const [addOnboardingItem, { isLoading }] = useAddOnboardingItemMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required')
      return
    }
    if (!image) {
      toast.error('Please select an image')
      return
    }

    try {
      await addOnboardingItem({ title: title.trim(), description: description.trim(), status, image }).unwrap()
      toast.success('Onboarding item added successfully')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to add onboarding item. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Onboarding Screen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Find Your Perfect Match" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Browse thousands of verified matrimony profiles."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
            </div>
          )}
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

export default AddOnboardingModal
