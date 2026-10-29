import React from 'react'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'

const KundaliPayments = () => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase()
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
        <CardTitle as="h4" className="mb-0">
          Kundali Payment List
        </CardTitle>

        <div style={{ width: '100%', maxWidth: '280px' }}>
          <div className="search-box position-relative">
            <input type="search" className="form-control" placeholder="Search member..." />

            <i className="ri-search-line position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
          </div>
        </div>
      </CardHeader>

      {/* ================= TABLE ================= */}
      <CardBody className="">
        <div className="table-responsive">
          <table
            className="table align-middle mb-0 table-hover table-centered table-bordered"
            style={{
              minWidth: '1150px',
            }}>
            <thead className="bg-light-subtle">
              <tr>
                <th className="text-center text-nowrap" style={{ width: '45px' }}>
                  <input type="checkbox" className="form-check-input" aria-label="Select all members" />
                </th>

                <th className="text-nowrap">SR.No</th>
                <th className="text-nowrap">Member ID</th>
                <th className="text-nowrap">Member Name</th>
                <th className="text-nowrap"> Price</th>
                <th className="text-nowrap">Created Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="text-center">
                  <input type="checkbox" className="form-check-input" />
                </td>

                <td className="text-nowrap">1</td>

                <td className="text-nowrap">
                  <span className="fw-medium">SJ01012000</span>
                </td>

                {/* USER WITH AVATAR */}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center flex-nowrap gap-2">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 fw-semibold"
                      style={{
                        width: '38px',
                        height: '38px',
                        background: '#EEF4FF',
                        color: '#4C6FFF',
                        fontSize: '13px',
                      }}>
                      {getInitials('Suraj', 'Jamdade')}
                    </div>

                    <div className="text-nowrap">
                      <div className="fw-semibold text-dark">Suraj Jamdade</div>
                    </div>
                  </div>
                </td>

                <td className="text-nowrap fw-semibold">₹ 299</td>

                <td className="text-nowrap">11 Sep 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  )
}

export default KundaliPayments
