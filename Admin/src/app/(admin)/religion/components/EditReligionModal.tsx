'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetReligionByIdQuery, useUpdateReligionMutation } from '../../../../../store/religionApi'

const EditReligionModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetReligionByIdQuery(id)
  const [updateReligion, { isLoading: isUpdating }] = useUpdateReligionMutation()
  const [name, setName] = useState('')

  useEffect(() => {
    if (data) {
      setName(data.data.religion)
    }
  }, [data])

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Religion name cannot be empty')
      return
    }
    try {
      await updateReligion({ id, religion: name }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Religion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <Form.Group>
            <Form.Label>Religion</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter religion name" />
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

export default EditReligionModal
