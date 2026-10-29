'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateQualificationMutation } from '../../../../store/qualificationApi'
const AddQualificationModal = ({ onClose }: { onClose: () => void }) => {
  const [createQualification, { isLoading }] = useCreateQualificationMutation()

  const [form, setForm] = useState({
    qualification: '',
    educationType: '',
    occupation: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.qualification.trim() || !form.educationType.trim() || !form.occupation.trim()) {
      alert('All fields are required')
      return
    }
    try {
      await createQualification(form).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Qualification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Qualification</Form.Label>
          <Form.Control
            value={form.qualification}
            onChange={(e) => handleChange('qualification', e.target.value)}
            placeholder="e.g. Diploma in Mechanical Engineering"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Education Type</Form.Label>
          <Form.Control value={form.educationType} onChange={(e) => handleChange('educationType', e.target.value)} placeholder="e.g. 12th" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Occupation</Form.Label>
          <Form.Control value={form.occupation} onChange={(e) => handleChange('occupation', e.target.value)} placeholder="e.g. HSC board" />
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

export default AddQualificationModal
