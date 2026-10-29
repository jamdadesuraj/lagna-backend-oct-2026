'use client'

import { Modal, Spinner } from 'react-bootstrap'
import { useGetAnnualIncomeByIdQuery } from '../../../../store/annualIncomeApi'

const ViewAnnualIncomeModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetAnnualIncomeByIdQuery(id)

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View Annual Income</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Spinner animation="border" size="sm" />}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}
        {data && (
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Annual Income</th>
                <td>{data.data.annualIncome}</td>
              </tr>
              <tr>
                <th>Min Income</th>
                <td>{data.data.minIncome.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <th>Max Income</th>
                <td>{data.data.maxIncome.toLocaleString('en-IN')}</td>
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

export default ViewAnnualIncomeModal
