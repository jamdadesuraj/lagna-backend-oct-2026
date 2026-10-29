'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetQualificationByIdQuery, useUpdateQualificationMutation } from '../../../../store/qualificationApi'

const EditQualificationModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetQualificationByIdQuery(id)
  const [updateQualification, { isLoading: isUpdating }] = useUpdateQualificationMutation()

  const [form, setForm] = useState({
    qualification: '',
    educationType: '',
    occupation: '',
  })

  useEffect(() => {
    if (data) {
      setForm({
        qualification: data.data.qualification,
        educationType: data.data.educationType,
        occupation: data.data.occupation,
      })
    }
  }, [data])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.qualification.trim() || !form.educationType.trim() || !form.occupation.trim()) {
      alert('All fields are required')
      return
    }
    try {
      await updateQualification({ id, ...form }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Qualification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Qualification</Form.Label>
              <Form.Control value={form.qualification} onChange={(e) => handleChange('qualification', e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Education Type</Form.Label>
              <Form.Control value={form.educationType} onChange={(e) => handleChange('educationType', e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Occupation</Form.Label>
              <Form.Control value={form.occupation} onChange={(e) => handleChange('occupation', e.target.value)} />
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

export default EditQualificationModal
