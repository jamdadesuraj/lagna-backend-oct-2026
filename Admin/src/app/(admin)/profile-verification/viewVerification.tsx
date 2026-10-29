'use client'

import { useState } from 'react'
import { Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetProfileVerificationByIdQuery, useReviewProfileVerificationMutation } from '../../../../store/profileVerificationApi'

const ReviewVerificationModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetProfileVerificationByIdQuery(id)
  const [reviewVerification, { isLoading: isReviewing }] = useReviewProfileVerificationMutation()

  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  const handleApprove = async () => {
    try {
      await reviewVerification({ id, body: { status: 'approved' } }).unwrap()
      onClose()
    } catch {
      alert('Failed to approve. Please try again.')
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    try {
      await reviewVerification({ id, body: { status: 'rejected', rejectionReason } }).unwrap()
      onClose()
    } catch {
      alert('Failed to reject. Please try again.')
    }
  }

  const request = data?.data

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Review Verification Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
          </div>
        )}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}

        {request && (
          <>
            <p>
              <strong>Profile ID:</strong> {request.profileId?.matrimonyId || request.profileId?._id}
            </p>
            <p>
              <strong>Current Status:</strong>{' '}
              <span className={`badge ${request.status === 'approved' ? 'bg-success' : request.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                {request.status}
              </span>
            </p>

            {(request.adhaarFrontUrl || request.selfieUrl) && (
              <div className="mb-3">
                <strong>Submitted Documents:</strong>
                <div className="d-flex gap-3 mt-2 flex-wrap">
                  {request.adhaarFrontUrl && (
                    <div>
                      <div className="text-muted small mb-1">Aadhaar Front</div>
                      <img
                        src={request.adhaarFrontUrl}
                        alt="aadhaar front"
                        style={{ width: 220, borderRadius: 6, border: '1px solid #ddd', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  {request.selfieUrl && (
                    <div>
                      <div className="text-muted small mb-1">Selfie</div>
                      <img
                        src={request.selfieUrl}
                        alt="selfie"
                        style={{ width: 220, borderRadius: 6, border: '1px solid #ddd', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {request.status === 'rejected' && request.rejectionReason && (
              <p className="text-danger">
                <strong>Previous Rejection Reason:</strong> {request.rejectionReason}
              </p>
            )}

            {showRejectForm && (
              <Form.Group className="mt-3">
                <Form.Label>Rejection Reason</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Aadhaar document is not clear"
                />
              </Form.Group>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isReviewing}>
          Cancel
        </Button>
        {!showRejectForm ? (
          <>
            {request?.status !== 'approved' && (
              <Button variant="danger" onClick={() => setShowRejectForm(true)} disabled={isReviewing || isLoading}>
                Reject
              </Button>
            )}
            {request?.status !== 'approved' && (
              <Button variant="success" onClick={handleApprove} disabled={isReviewing || isLoading}>
                {isReviewing ? <Spinner animation="border" size="sm" /> : 'Approve'}
              </Button>
            )}
          </>
        ) : (
          <Button variant="danger" onClick={handleReject} disabled={isReviewing}>
            {isReviewing ? <Spinner animation="border" size="sm" /> : 'Confirm Reject'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ReviewVerificationModal
