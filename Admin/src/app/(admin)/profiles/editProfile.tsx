'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { useGetProfileByIdQuery, useUpdateProfileMutation } from '../../../../store/profilesApi'
import ProfileFormFields, { emptyProfile } from './form'
import { toast } from 'react-toastify'

const EditProfileModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetProfileByIdQuery(id)
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [form, setForm] = useState(emptyProfile)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])

  useEffect(() => {
    if (data?.data) {
      const { _id, matrimonyId, subscription, isVerified, isBlocked, isDeleted, createdAt, updatedAt, __v, ...rest } = data.data
      setForm(rest)
    }
  }, [data])

  const handleSubmit = async () => {
    if (!form.basicDetails.firstName.trim() || !form.basicDetails.gender.trim()) {
      toast.error('First name and gender are required')
      return
    }
    try {
      await updateProfile({ id, body: form }).unwrap()
      toast.success('Profile updated successfully')
      onClose()
    } catch (err: any) {
      const zodErrors = err?.data?.errors?.fieldErrors
      if (zodErrors) {
        Object.values(zodErrors)
          .flat()
          .forEach((msg) => toast.error(msg as string))
      } else {
        toast.error(err?.data?.message || 'Failed to update. Please try again.')
      }
    }
  }

  return (
    <Modal show onHide={onClose} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
          </div>
        )}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && <ProfileFormFields form={form} setForm={setForm} photoFiles={photoFiles} setPhotoFiles={setPhotoFiles} />}
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

export default EditProfileModal
