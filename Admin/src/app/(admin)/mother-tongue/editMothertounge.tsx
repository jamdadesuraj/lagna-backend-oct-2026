'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetMotherTongueByIdQuery, useUpdateMotherTongueMutation } from '../../../../store/motherToungeApi'

const EditMotherTongueModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetMotherTongueByIdQuery(id)
  const [updateMotherTongue, { isLoading: isUpdating }] = useUpdateMotherTongueMutation()
  const [name, setName] = useState('')

  useEffect(() => {
    if (data) {
      setName(data.data.motherTongue)
    }
  }, [data])

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Mother tongue cannot be empty')
      return
    }
    try {
      await updateMotherTongue({ id, motherTongue: name }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Mother Tongue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <Form.Group>
            <Form.Label>Mother Tongue</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter mother tongue" />
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

export default EditMotherTongueModal
