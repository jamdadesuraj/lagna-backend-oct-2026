'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateMotherTongueMutation } from '../../../../../store/motherToungeApi'

const AddMotherTongueModal = ({ onClose }: { onClose: () => void }) => {
  const [createMotherTongue, { isLoading }] = useCreateMotherTongueMutation()
  const [name, setName] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Name cannot be empty')
      return
    }
    try {
      await createMotherTongue({ motherTongue: name }).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Mother Tongue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Mother Tongue</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter mother tongue" />
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

export default AddMotherTongueModal
