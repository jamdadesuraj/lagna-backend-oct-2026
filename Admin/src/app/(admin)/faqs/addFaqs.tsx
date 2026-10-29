'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'

import { useCreateFaqMutation } from '../../../../store/faqAPi'
import { useGetHelpCentersQuery } from '../../../../store/helpCentreApi'

const AddFaqModal = ({ onClose }: { onClose: () => void }) => {
  const [createFaq, { isLoading }] = useCreateFaqMutation()
  const { data: helpCenterRes, isLoading: isLoadingCategories } = useGetHelpCentersQuery()
  const categories = helpCenterRes?.data ?? []

  const [form, setForm] = useState({
    helpCenterId: '',
    question: '',
    answer: '',
    displayOrder: 1,
    isActive: true,
  })

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.helpCenterId) {
      alert('Please select a category')
      return
    }
    if (!form.question.trim() || !form.answer.trim()) {
      alert('Question and answer are required')
      return
    }
    try {
      await createFaq({ ...form, displayOrder: Number(form.displayOrder) }).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add FAQ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select value={form.helpCenterId} onChange={(e) => handleChange('helpCenterId', e.target.value)} disabled={isLoadingCategories}>
            <option value="">{isLoadingCategories ? 'Loading categories...' : 'Select a category'}</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            value={form.question}
            onChange={(e) => handleChange('question', e.target.value)}
            placeholder="e.g. How do I create a profile?"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Answer</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.answer}
            onChange={(e) => handleChange('answer', e.target.value)}
            placeholder="e.g. Sign up using your mobile number and complete your profile."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Display Order</Form.Label>
          <Form.Control type="number" value={form.displayOrder} onChange={(e) => handleChange('displayOrder', e.target.value)} />
        </Form.Group>
        <Form.Check
          type="switch"
          id="add-faq-active"
          label="Active"
          checked={form.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
        />
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

export default AddFaqModal
