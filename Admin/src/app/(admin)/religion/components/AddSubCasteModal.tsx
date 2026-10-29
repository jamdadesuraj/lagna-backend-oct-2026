'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateSubCasteMutation } from '../../../../../store/subCasteApi'
import { useGetReligionsQuery } from '../../../../../store/religionApi'
import { useGetCastesByReligionQuery } from '../../../../../store/casteApi'

const AddSubCasteModal = ({ onClose }: { onClose: () => void }) => {
  const { data: religionRes, isLoading: isLoadingReligions } = useGetReligionsQuery()
  const [createSubCaste, { isLoading }] = useCreateSubCasteMutation()

  const [religionId, setReligionId] = useState('')
  const [casteId, setCasteId] = useState('')
  const [subCaste, setSubCaste] = useState('')

  const { data: casteRes, isLoading: isLoadingCastes } = useGetCastesByReligionQuery(religionId, {
    skip: !religionId,
  })

  // reset caste selection whenever religion changes
  useEffect(() => {
    setCasteId('')
  }, [religionId])

  const handleSubmit = async () => {
    if (!religionId) {
      alert('Please select a religion')
      return
    }
    if (!casteId) {
      alert('Please select a caste')
      return
    }
    if (!subCaste.trim()) {
      alert('Sub-caste name cannot be empty')
      return
    }
    try {
      await createSubCaste({ religionId, casteId, subCaste }).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Sub-Caste</Modal.Title>
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

        <Form.Group className="mb-3">
          <Form.Label>Caste</Form.Label>
          <Form.Select value={casteId} onChange={(e) => setCasteId(e.target.value)} disabled={!religionId || isLoadingCastes}>
            <option value="">{religionId ? 'Select caste' : 'Select religion first'}</option>
            {casteRes?.data.map((c) => (
              <option key={c._id} value={c._id}>
                {c.caste}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Sub-Caste</Form.Label>
          <Form.Control type="text" value={subCaste} onChange={(e) => setSubCaste(e.target.value)} placeholder="Enter sub-caste name" />
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

export default AddSubCasteModal
