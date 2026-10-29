'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateOccupationMutation } from '../../../../store/occupationApi'

const AddOccupationModal = ({ onClose }: { onClose: () => void }) => {
  const [createOccupation, { isLoading }] = useCreateOccupationMutation()

  const [occupation, setOccupation] = useState('')

  const handleSubmit = async () => {
    if (!occupation.trim()) {
      alert('Occupation is required')
      return
    }
    try {
      await createOccupation({ occupation }).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Occupation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Occupation</Form.Label>
          <Form.Control type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. IT/ Software" />
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

export default AddOccupationModal
