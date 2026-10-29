'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useCreateAnnualIncomeMutation } from '../../../../store/annualIncomeApi'
const AddAnnualIncomeModal = ({ onClose }: { onClose: () => void }) => {
  const [createAnnualIncome, { isLoading }] = useCreateAnnualIncomeMutation()

  const [annualIncome, setAnnualIncome] = useState('')
  const [minIncome, setMinIncome] = useState('')
  const [maxIncome, setMaxIncome] = useState('')

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
      await createAnnualIncome({
        annualIncome,
        minIncome: Number(minIncome),
        maxIncome: Number(maxIncome),
      }).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Annual Income</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Annual Income Label</Form.Label>
          <Form.Control type="text" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="e.g. ₹ 5 Lakhs to 7 Lakhs" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Min Income</Form.Label>
          <Form.Control type="number" value={minIncome} onChange={(e) => setMinIncome(e.target.value)} placeholder="e.g. 500000" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Max Income</Form.Label>
          <Form.Control type="number" value={maxIncome} onChange={(e) => setMaxIncome(e.target.value)} placeholder="e.g. 700000" />
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

export default AddAnnualIncomeModal
