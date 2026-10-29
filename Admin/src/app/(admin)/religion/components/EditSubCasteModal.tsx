'use client'

import { useState, useEffect, useRef } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetSubCasteByIdQuery, useUpdateSubCasteMutation } from '../../../../../store/subCasteApi'
import { useGetReligionsQuery } from '../../../../../store/religionApi'
import { useGetCastesByReligionQuery } from '../../../../../store/casteApi'

const EditSubCasteModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetSubCasteByIdQuery(id)
  const { data: religionRes, isLoading: isLoadingReligions } = useGetReligionsQuery()
  const [updateSubCaste, { isLoading: isUpdating }] = useUpdateSubCasteMutation()

  const [religionId, setReligionId] = useState('')
  const [casteId, setCasteId] = useState('')
  const [subCaste, setSubCaste] = useState('')

  const hasInitialized = useRef(false)

  const { data: casteRes, isLoading: isLoadingCastes } = useGetCastesByReligionQuery(religionId, {
    skip: !religionId,
  })

  // Pre-fill fields once data loads
  useEffect(() => {
    if (data) {
      setReligionId(data.data.religionId._id)
      setCasteId(data.data.casteId._id)
      setSubCaste(data.data.subCaste)
    }
  }, [data])

  // Reset caste selection only when religion is changed manually (not on initial load)
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      return
    }
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
      await updateSubCaste({ id, religionId, casteId, subCaste }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Sub-Caste</Modal.Title>
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

export default EditSubCasteModal
