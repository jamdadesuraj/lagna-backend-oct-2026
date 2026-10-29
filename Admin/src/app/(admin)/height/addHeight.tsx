'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateHeightMutation } from '../../../../store/heightApi'
const AddHeightModal = ({ onClose }: { onClose: () => void }) => {
  const [createHeight, { isLoading }] = useCreateHeightMutation()
  const [height, setHeight] = useState('')

  const handleSubmit = async () => {
    if (!height.trim()) {
      alert('Height cannot be empty')
      return
    }
    try {
      await createHeight({ height }).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Height</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Height</Form.Label>
          <Form.Control type="text" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={`e.g. 5'8"`} />
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

export default AddHeightModal
