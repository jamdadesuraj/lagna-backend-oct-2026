'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetOccupationByIdQuery, useUpdateOccupationMutation } from '../../../../store/occupationApi'

const EditOccupationModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetOccupationByIdQuery(id)
  const [updateOccupation, { isLoading: isUpdating }] = useUpdateOccupationMutation()

  const [occupation, setOccupation] = useState('')

  useEffect(() => {
    if (data) {
      setOccupation(data.data.occupation)
    }
  }, [data])

  const handleSubmit = async () => {
    if (!occupation.trim()) {
      alert('Occupation is required')
      return
    }
    try {
      await updateOccupation({ id, occupation }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Occupation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <Form.Group>
            <Form.Label>Occupation</Form.Label>
            <Form.Control type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
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

export default EditOccupationModal
