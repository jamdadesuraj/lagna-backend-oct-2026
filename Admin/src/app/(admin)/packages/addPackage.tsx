'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form, Row, Col } from 'react-bootstrap'
import { useCreatePackageMutation } from '../../../../store/packageApi'

const AddPackageModal = ({ onClose }: { onClose: () => void }) => {
  const [createPackage, { isLoading }] = useCreatePackageMutation()

  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 1,
    durationType: 'MONTH',
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    badge: '',
    displayOrder: 1,
  })
  const [featuresText, setFeaturesText] = useState('')

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert('Title is required')
      return
    }

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    try {
      await createPackage({
        ...form,
        duration: Number(form.duration),
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        discountPercentage: Number(form.discountPercentage),
        displayOrder: Number(form.displayOrder),
        features,
      }).unwrap()
      onClose()
    } catch {
      alert('Failed to create package. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Package</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="e.g. Gold" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Badge</Form.Label>
              <Form.Control value={form.badge} onChange={(e) => handleChange('badge', e.target.value)} placeholder="e.g. Popular" />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Duration</Form.Label>
              <Form.Control type="number" value={form.duration} onChange={(e) => handleChange('duration', e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Duration Type</Form.Label>
              <Form.Select value={form.durationType} onChange={(e) => handleChange('durationType', e.target.value)}>
                <option value="DAY">DAY</option>
                <option value="MONTH">MONTH</option>
                <option value="YEAR">YEAR</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Display Order</Form.Label>
              <Form.Control type="number" value={form.displayOrder} onChange={(e) => handleChange('displayOrder', e.target.value)} />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Original Price (₹)</Form.Label>
              <Form.Control type="number" value={form.originalPrice} onChange={(e) => handleChange('originalPrice', e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Discount %</Form.Label>
              <Form.Control type="number" value={form.discountPercentage} onChange={(e) => handleChange('discountPercentage', e.target.value)} />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label>Features (one per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder={'Valid for 3 months\nView 50 phone numbers\nUnlimited messages'}
              />
            </Form.Group>
          </Col>
        </Row>
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

export default AddPackageModal
