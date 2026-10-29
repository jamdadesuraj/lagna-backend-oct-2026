'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetFaqByIdQuery, useUpdateFaqMutation } from '../../../../store/faqAPi'
import { useGetHelpCentersQuery } from '../../../../store/helpCentreApi'

const EditFaqModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetFaqByIdQuery(id)
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation()
  const { data: helpCenterRes, isLoading: isLoadingCategories } = useGetHelpCentersQuery()
  const categories = helpCenterRes?.data ?? []

  const [form, setForm] = useState({
    helpCenterId: '',
    question: '',
    answer: '',
    displayOrder: 1,
    isActive: true,
  })

  useEffect(() => {
    if (data) {
      const helpCenterId = typeof data.data.helpCenterId === 'string' ? data.data.helpCenterId : data.data.helpCenterId._id

      setForm({
        helpCenterId,
        question: data.data.question,
        answer: data.data.answer,
        displayOrder: data.data.displayOrder,
        isActive: data.data.isActive,
      })
    }
  }, [data])

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
      await updateFaq({ id, ...form, displayOrder: Number(form.displayOrder) }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit FAQ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <>
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
              <Form.Control value={form.question} onChange={(e) => handleChange('question', e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.answer} onChange={(e) => handleChange('answer', e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Display Order</Form.Label>
              <Form.Control type="number" value={form.displayOrder} onChange={(e) => handleChange('displayOrder', e.target.value)} />
            </Form.Group>
            <Form.Check
              type="switch"
              id="edit-faq-active"
              label="Active"
              checked={form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
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

export default EditFaqModal
