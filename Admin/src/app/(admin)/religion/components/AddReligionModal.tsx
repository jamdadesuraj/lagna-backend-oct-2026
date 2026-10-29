'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateReligionMutation } from '../../../../../store/religionApi'

const AddReligionModal = ({ onClose }: { onClose: () => void }) => {
  const [createReligion, { isLoading }] = useCreateReligionMutation()
  const [name, setName] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Religion name cannot be empty')
      return
    }
    try {
      await createReligion({ religion: name }).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Religion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Religion</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter religion name" />
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

export default AddReligionModal
