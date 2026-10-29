'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardBody, CardHeader, CardTitle, Spinner, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useGetBlockedProfilesQuery, useUnblockProfileMutation } from '../../../../../store/reportProfileApi'

const BlockedProfiles = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const { data, isLoading, isError } = useGetBlockedProfilesQuery()
  const [unblockProfile, { isLoading: isUnblocking }] = useUnblockProfileMutation()

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase()
  }

  const blockedReports = (data?.data ?? []).filter((report) => {
    const profile = report.reportedProfileId
    const name = `${profile?.basicDetails?.firstName ?? ''} ${profile?.basicDetails?.lastName ?? ''}`.toLowerCase()
    const matrimonyId = profile?.matrimonyId?.toLowerCase() ?? ''
    const term = search.toLowerCase()
    return name.includes(term) || matrimonyId.includes(term)
  })

  const handleUnblock = async (profileId: string) => {
    try {
      await unblockProfile(profileId).unwrap()
      toast.success('Profile unblocked successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to unblock profile. Please try again.')
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
        <CardTitle as="h4" className="mb-0">
          Blocked Profiles List
        </CardTitle>

        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
          <div className="search-box position-relative" style={{ width: '220px' }}>
            <input type="search" className="form-control" placeholder="Search member..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <i className="ri-search-line position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
          </div>

          <Button variant="outline-secondary" size="sm" onClick={() => router.push('/profiles/report')}>
            <IconifyIcon icon="solar:arrow-left-bold-duotone" className="align-middle fs-16 me-1" />
            Back to Reports
          </Button>
        </div>
      </CardHeader>

      {/* ================= TABLE ================= */}
      <CardBody className="">
        {isLoading && (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" />
          </div>
        )}

        {isError && <p className="text-danger mb-0">Failed to load blocked profiles.</p>}

        {!isLoading && !isError && (
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
                  <th className="text-nowrap">Member</th>
                  <th className="text-nowrap">Block Reason</th>
                  <th className="text-nowrap">Status</th>
                  <th className="text-nowrap">Action</th>
                </tr>
              </thead>

              <tbody>
                {blockedReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No blocked profiles found.
                    </td>
                  </tr>
                )}

                {blockedReports.map((report, index) => {
                  const profile = report.reportedProfileId
                  const firstName = profile?.basicDetails?.firstName ?? ''
                  const lastName = profile?.basicDetails?.lastName ?? ''

                  return (
                    <tr key={report._id}>
                      <td className="text-center">
                        <input type="checkbox" className="form-check-input" />
                      </td>

                      <td className="text-nowrap">{index + 1}</td>

                      <td className="text-nowrap">
                        <span className="fw-medium">{profile?.matrimonyId ?? '-'}</span>
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
                            {getInitials(firstName, lastName)}
                          </div>

                          <div className="text-nowrap">
                            <div className="fw-semibold text-dark">
                              {firstName} {lastName}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="text-nowrap">{report.reason ?? '-'}</td>

                      <td className="text-nowrap">
                        <span className="badge bg-danger-subtle text-danger">Blocked</span>
                      </td>

                      <td className="text-nowrap">
                        <button
                          type="button"
                          className="btn btn-soft-success btn-sm"
                          title="Unblock User"
                          disabled={isUnblocking || !profile?._id}
                          onClick={() => profile?._id && handleUnblock(profile._id)}>
                          <IconifyIcon icon="solar:user-check-bold-duotone" className="align-middle fs-18" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default BlockedProfiles
