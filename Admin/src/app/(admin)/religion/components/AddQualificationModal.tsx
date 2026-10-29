'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateQualificationMutation } from '../../../../../store/qualificationApi'

const AddQualificationModal = ({ onClose }: { onClose: () => void }) => {
  const [createQualification, { isLoading }] = useCreateQualificationMutation()

  const [qualification, setQualification] = useState('')
  const [educationType, setEducationType] = useState('')
  const [occupation, setOccupation] = useState('')
  const [annualIncome, setAnnualIncome] = useState('')

  const handleSubmit = async () => {
    if (!qualification.trim() || !educationType.trim() || !occupation.trim() || !annualIncome.trim()) {
      alert('All fields are required')
      return
    }
    try {
      await createQualification({ qualification, educationType, occupation, annualIncome }).unwrap()
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
            type="text"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder="e.g. Bachelor's in Computer Science"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Education Type</Form.Label>
          <Form.Control type="text" value={educationType} onChange={(e) => setEducationType(e.target.value)} placeholder="e.g. Full-time" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Occupation</Form.Label>
          <Form.Control type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Software Engineer" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Annual Income</Form.Label>
          <Form.Control type="text" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="e.g. 800000" />
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
