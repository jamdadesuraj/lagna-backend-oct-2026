'use client'

import { Modal, Spinner } from 'react-bootstrap'
import { useGetOccupationByIdQuery } from '../../../../store/occupationApi'

const ViewOccupationModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetOccupationByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View Occupation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Occupation</th>
                <td>{data.data.occupation}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  <span className={`badge ${data.data.isDeleted ? 'bg-secondary' : 'bg-success'}`}>
                    {data.data.isDeleted ? 'Inactive' : 'Active'}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>{new Date(data.data.createdAt).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Updated At</th>
                <td>{new Date(data.data.updatedAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ViewOccupationModal
