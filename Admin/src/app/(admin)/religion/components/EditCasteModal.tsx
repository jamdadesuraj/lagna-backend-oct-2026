'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetCasteByIdQuery, useUpdateCasteMutation } from '../../../../../store/casteApi'
import { useGetReligionsQuery } from '../../../../../store/religionApi'

const EditCasteModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetCasteByIdQuery(id)
  const { data: religionRes, isLoading: isLoadingReligions } = useGetReligionsQuery()
  const [updateCaste, { isLoading: isUpdating }] = useUpdateCasteMutation()

  const [religionId, setReligionId] = useState('')
  const [caste, setCaste] = useState('')

  useEffect(() => {
    if (data) {
      setReligionId(data.data.religionId._id)
      setCaste(data.data.caste)
    }
  }, [data])

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
      await updateCaste({ id, religionId, caste }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Caste</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <>
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
          </>
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

export default EditCasteModal
