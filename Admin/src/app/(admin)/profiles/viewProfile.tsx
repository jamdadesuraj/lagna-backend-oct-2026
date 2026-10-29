'use client'

import { Modal, Spinner } from 'react-bootstrap'
import { useGetProfileByIdQuery } from '../../../../store/profilesApi'

const ViewProfileModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data, isLoading, isError } = useGetProfileByIdQuery(id)
  const p = data?.data

  return (
    <Modal show onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>View Profile {p ? `— ${p.matrimonyId}` : ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
          </div>
        )}
        {isError && <p className="text-danger mb-0">Failed to load details.</p>}

        {p && (
          <>
            {p.photos?.length > 0 && (
              <div className="d-flex gap-2 mb-3 flex-wrap">
                {p.photos.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`photo-${i}`} width={90} height={90} style={{ objectFit: 'cover', borderRadius: 8 }} />
                ))}
              </div>
            )}

            <h6 className="mb-2">Basic Details</h6>
            <table className="table table-borderless mb-3">
              <tbody>
                <tr>
                  <th style={{ width: '35%' }}>Name</th>
                  <td>
                    {p.basicDetails?.firstName} {p.basicDetails?.lastName}
                  </td>
                </tr>
                <tr>
                  <th>Gender</th>
                  <td>{p.basicDetails?.gender}</td>
                </tr>
                <tr>
                  <th>Age</th>
                  <td>{p.basicDetails?.age}</td>
                </tr>
                <tr>
                  <th>Height</th>
                  <td>{p.basicDetails?.height}</td>
                </tr>
                <tr>
                  <th>Marital Status</th>
                  <td>{p.basicDetails?.maritalStatus}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <span className={`badge me-1 ${p.isVerified ? 'bg-success' : 'bg-secondary'}`}>{p.isVerified ? 'Verified' : 'Unverified'}</span>
                    {p.isBlocked && <span className="badge bg-danger">Blocked</span>}
                  </td>
                </tr>
              </tbody>
            </table>

            <h6 className="mb-2">Education & Career</h6>
            <table className="table table-borderless mb-3">
              <tbody>
                <tr>
                  <th style={{ width: '35%' }}>Qualification</th>
                  <td>{p.educationDetails?.highestQualification}</td>
                </tr>
                <tr>
                  <th>Occupation</th>
                  <td>{p.educationDetails?.occupation}</td>
                </tr>
                <tr>
                  <th>Annual Income</th>
                  <td>{p.educationDetails?.annualIncome}</td>
                </tr>
                <tr>
                  <th>Employed In</th>
                  <td>{p.careerDetails?.employedIn}</td>
                </tr>
                <tr>
                  <th>Organization</th>
                  <td>{p.careerDetails?.organizationName}</td>
                </tr>
              </tbody>
            </table>

            <h6 className="mb-2">Religion & Location</h6>
            <table className="table table-borderless mb-3">
              <tbody>
                <tr>
                  <th style={{ width: '35%' }}>Religion</th>
                  <td>{p.religionDetails?.religion}</td>
                </tr>
                <tr>
                  <th>Caste</th>
                  <td>{p.religionDetails?.caste}</td>
                </tr>
                <tr>
                  <th>Mother Tongue</th>
                  <td>{p.religionDetails?.motherTongue}</td>
                </tr>
                <tr>
                  <th>City</th>
                  <td>
                    {p.locationDetails?.city}, {p.locationDetails?.state}, {p.locationDetails?.country}
                  </td>
                </tr>
              </tbody>
            </table>

            <h6 className="mb-2">Family</h6>
            <table className="table table-borderless mb-3">
              <tbody>
                <tr>
                  <th style={{ width: '35%' }}>Father's Occupation</th>
                  <td>{p.family?.fatherOccupation}</td>
                </tr>
                <tr>
                  <th>Mother's Occupation</th>
                  <td>{p.family?.motherOccupation}</td>
                </tr>
                <tr>
                  <th>Family Status</th>
                  <td>{p.family?.familyStatus}</td>
                </tr>
                <tr>
                  <th>Siblings</th>
                  <td>
                    {p.family?.brothers} brother(s), {p.family?.sisters} sister(s)
                  </td>
                </tr>
              </tbody>
            </table>

            <h6 className="mb-2">Contact</h6>
            <table className="table table-borderless mb-3">
              <tbody>
                <tr>
                  <th style={{ width: '35%' }}>Email</th>
                  <td>{p.contactDetails?.email}</td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td>{p.contactDetails?.phoneNumber}</td>
                </tr>
              </tbody>
            </table>

            {p.aboutMe?.about && (
              <>
                <h6 className="mb-2">About</h6>
                <p>{p.aboutMe.about}</p>
              </>
            )}

            <table className="table table-borderless mb-0">
              <tbody>
                <tr>
                  <th style={{ width: '35%' }}>Created At</th>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Updated At</th>
                  <td>{new Date(p.updatedAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ViewProfileModal
