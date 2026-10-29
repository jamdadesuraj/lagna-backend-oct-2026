'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardBody, CardFooter, Form, Button, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetContactUsQuery, useCreateOrUpdateContactUsMutation } from '../../../../store/contact-usApi'
const ContactUsEditor = () => {
  const { data, isLoading, isError } = useGetContactUsQuery()
  const [saveContactUs, { isLoading: isSaving }] = useCreateOrUpdateContactUsMutation()

  const [officeAddress, setOfficeAddress] = useState('')
  const [email, setEmail] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // populate the form whenever fresh data arrives
  useEffect(() => {
    if (data?.data) {
      setOfficeAddress(data.data.officeAddress ?? '')
      setEmail(data.data.email ?? '')
    }
  }, [data])

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSave = async () => {
    if (!officeAddress.trim()) {
      alert('Office address is required')
      return
    }
    if (!email.trim() || !isValidEmail(email)) {
      alert('A valid email is required')
      return
    }
    try {
      await saveContactUs({ officeAddress, email }).unwrap()
      setIsEditing(false)
    } catch {
      alert('Failed to save. Please try again.')
    }
  }

  const handleCancel = () => {
    // revert any unsaved edits back to the last fetched value
    setOfficeAddress(data?.data?.officeAddress ?? '')
    setEmail(data?.data?.email ?? '')
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center gap-1">
        <CardTitle as={'h4'} className="flex-grow-1">
          Contact Us
        </CardTitle>
        {!isEditing && !isLoading && (
          <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(true)}>
            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18 me-1" />
            Edit
          </button>
        )}
      </CardHeader>

      <CardBody>
        {isLoading && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
          </div>
        )}

        {isError && <p className="text-danger mb-0">Failed to load contact details.</p>}

        {!isLoading && !isError && !isEditing && (
          <>
            {!officeAddress && !email ? (
              <p className="mb-0 text-muted">No contact details have been set yet.</p>
            ) : (
              <>
                <p className="mb-2">
                  <strong>Office Address:</strong> {officeAddress || '—'}
                </p>
                <p className="mb-0">
                  <strong>Email:</strong> {email || '—'}
                </p>
              </>
            )}
          </>
        )}

        {!isLoading && !isError && isEditing && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Office Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                placeholder="Enter office address..."
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="support@example.com" />
            </Form.Group>
          </>
        )}
      </CardBody>

      {isEditing && (
        <CardFooter className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default ContactUsEditor
