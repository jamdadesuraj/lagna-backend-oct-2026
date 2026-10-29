'use client'

import { Modal, Spinner } from 'react-bootstrap'
import { useGetMotherTongueByIdQuery } from '../../../../../store/motherToungeApi'

const ViewMotherTongueModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetMotherTongueByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mother Tongue Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <>
            <p>
              <strong>Name:</strong> {data.data.motherTongue}
            </p>
            <p>
              <strong>Status:</strong> {data.data.isDeleted ? 'Inactive' : 'Active'}
            </p>
            <p className="mb-0">
              <strong>Created At:</strong> {new Date(data.data.createdAt).toLocaleString()}
            </p>
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ViewMotherTongueModal
