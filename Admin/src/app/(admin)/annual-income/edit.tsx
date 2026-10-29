'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetAnnualIncomeByIdQuery, useUpdateAnnualIncomeMutation } from '../../../../store/annualIncomeApi'

const EditAnnualIncomeModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetAnnualIncomeByIdQuery(id)
  const [updateAnnualIncome, { isLoading: isUpdating }] = useUpdateAnnualIncomeMutation()

  const [annualIncome, setAnnualIncome] = useState('')
  const [minIncome, setMinIncome] = useState('')
  const [maxIncome, setMaxIncome] = useState('')

  useEffect(() => {
    if (data) {
      setAnnualIncome(data.data.annualIncome)
      setMinIncome(String(data.data.minIncome))
      setMaxIncome(String(data.data.maxIncome))
    }
  }, [data])

  const handleSubmit = async () => {
    if (!annualIncome.trim() || !minIncome.trim() || !maxIncome.trim()) {
      alert('All fields are required')
      return
    }
    if (Number(minIncome) >= Number(maxIncome)) {
      alert('Min income must be less than max income')
      return
    }
    try {
      await updateAnnualIncome({
        id,
        annualIncome,
        minIncome: Number(minIncome),
        maxIncome: Number(maxIncome),
      }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Annual Income</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Annual Income Label</Form.Label>
              <Form.Control type="text" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Min Income</Form.Label>
              <Form.Control type="number" value={minIncome} onChange={(e) => setMinIncome(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Max Income</Form.Label>
              <Form.Control type="number" value={maxIncome} onChange={(e) => setMaxIncome(e.target.value)} />
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

export default EditAnnualIncomeModal
