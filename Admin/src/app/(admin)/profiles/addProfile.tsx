'use client'

import { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { useAddProfileMutation } from '../../../../store/profilesApi'
import ProfileFormFields, { emptyProfile } from './form'
import { toast } from 'react-toastify'
const AddProfileModal = ({ onClose }: { onClose: () => void }) => {
  const [addProfile, { isLoading }] = useAddProfileMutation()
  const [form, setForm] = useState(emptyProfile)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])

  const handleSubmit = async () => {
    if (!form.basicDetails.firstName.trim() || !form.basicDetails.gender.trim()) {
      toast.error('First name and gender are required')
      return
    }
    const formData = new FormData()
    formData.append('data', JSON.stringify(form))
    photoFiles.forEach((file) => formData.append('photos', file))

    try {
      await addProfile(formData).unwrap()
      toast.success('Profile added successfully')
      onClose()
    } catch (err: any) {
      const zodErrors = err?.data?.errors?.fieldErrors
      if (zodErrors) {
        Object.values(zodErrors)
          .flat()
          .forEach((msg) => toast.error(msg as string))
      } else {
        toast.error(err?.data?.message || 'Failed to create. Please try again.')
      }
    }
  }

  return (
    <Modal show onHide={onClose} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProfileFormFields form={form} setForm={setForm} photoFiles={photoFiles} setPhotoFiles={setPhotoFiles} />
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

export default AddProfileModal
