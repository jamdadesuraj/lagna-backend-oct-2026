'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetHeightByIdQuery, useUpdateHeightMutation } from '../../../../store/heightApi'

const EditHeightModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetHeightByIdQuery(id)
  const [updateHeight, { isLoading: isUpdating }] = useUpdateHeightMutation()
  const [height, setHeight] = useState('')

  useEffect(() => {
    if (data) {
      setHeight(data.data.height)
    }
  }, [data])

  const handleSubmit = async () => {
    if (!height.trim()) {
      alert('Height cannot be empty')
      return
    }
    try {
      await updateHeight({ id, height }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Height</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <Form.Group>
            <Form.Label>Height</Form.Label>
            <Form.Control type="text" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Enter height" />
          </Form.Group>
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

export default EditHeightModal
