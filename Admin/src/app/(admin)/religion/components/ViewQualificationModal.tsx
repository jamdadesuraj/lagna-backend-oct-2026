'use client'

import { Modal, Spinner } from 'react-bootstrap'
import { useGetQualificationByIdQuery } from '../../../../../store/qualificationApi'

const ViewQualificationModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetQualificationByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Qualification Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <>
            <p>
              <strong>Qualification:</strong> {data.data.qualification}
            </p>
            <p>
              <strong>Education Type:</strong> {data.data.educationType}
            </p>
            <p>
              <strong>Occupation:</strong> {data.data.occupation}
            </p>
            <p>
              <strong>Annual Income:</strong> {data.data.annualIncome}
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

export default ViewQualificationModal
