'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateCasteMutation } from '../../../../../store/casteApi'
import { useGetReligionsQuery } from '../../../../../store/religionApi'

const AddCasteModal = ({ onClose }: { onClose: () => void }) => {
  const { data: religionRes, isLoading: isLoadingReligions } = useGetReligionsQuery()
  const [createCaste, { isLoading }] = useCreateCasteMutation()

  const [religionId, setReligionId] = useState('')
  const [caste, setCaste] = useState('')

  const handleSubmit = async () => {
    if (!religionId) {
      alert('Please select a religion')
      return
    }
    if (!caste.trim()) {
      alert('Caste name cannot be empty')
      return
    }
    try {
      await createCaste({ religionId, caste }).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Caste</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Religion</Form.Label>
          <Form.Select value={religionId} onChange={(e) => setReligionId(e.target.value)} disabled={isLoadingReligions}>
            <option value="">Select religion</option>
            {religionRes?.data.map((r) => (
              <option key={r._id} value={r._id}>
                {r.religion}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Caste</Form.Label>
          <Form.Control type="text" value={caste} onChange={(e) => setCaste(e.target.value)} placeholder="Enter caste name" />
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

export default AddCasteModal
