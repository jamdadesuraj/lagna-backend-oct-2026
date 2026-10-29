'use client'

import { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'react-bootstrap'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useCreateOrUpdateCounterMutation, useGetCounterQuery } from '../../../../store/counterApi'

const CounterEditor = () => {
  const { data, isLoading, isError } = useGetCounterQuery()

  const [saveCounter, { isLoading: isSaving }] = useCreateOrUpdateCounterMutation()

  const [mobileVerifiedProfiles, setMobileVerifiedProfiles] = useState('')
  const [customersServed, setCustomersServed] = useState('')
  const [successfulMatchmakingYears, setSuccessfulMatchmakingYears] = useState('')

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (data?.data) {
      setMobileVerifiedProfiles(data.data.mobileVerifiedProfiles ?? '')
      setCustomersServed(data.data.customersServed ?? '')
      setSuccessfulMatchmakingYears(data.data.successfulMatchmakingYears ?? '')
    }
  }, [data])

  const handleSave = async () => {
    if (!mobileVerifiedProfiles.trim() || !customersServed.trim() || !successfulMatchmakingYears.trim()) {
      alert('All counter fields are required')
      return
    }

    try {
      await saveCounter({
        mobileVerifiedProfiles,
        customersServed,
        successfulMatchmakingYears,
      }).unwrap()

      setIsEditing(false)
    } catch {
      alert('Failed to save. Please try again.')
    }
  }

  const handleCancel = () => {
    setMobileVerifiedProfiles(data?.data?.mobileVerifiedProfiles ?? '')
    setCustomersServed(data?.data?.customersServed ?? '')
    setSuccessfulMatchmakingYears(data?.data?.successfulMatchmakingYears ?? '')

    setIsEditing(false)
  }

  const counterItems = [
    {
      title: 'Mobile Verified Profiles',
      value: mobileVerifiedProfiles,
      icon: 'solar:smartphone-2-bold-duotone',
      iconBg: '#EEF4FF',
      iconColor: '#4C6FFF',
      description: 'Verified member profiles',
    },
    {
      title: 'Customers Served',
      value: customersServed,
      icon: 'solar:users-group-rounded-bold-duotone',
      iconBg: '#ECFDF3',
      iconColor: '#12B76A',
      description: 'Total customers served',
    },
    {
      title: 'Matchmaking Experience',
      value: successfulMatchmakingYears,
      icon: 'solar:heart-bold-duotone',
      iconBg: '#FFF1F3',
      iconColor: '#F04466',
      description: 'Successful matchmaking years',
    },
  ]

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-white border-bottom px-3 px-md-4 py-3">
        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
              style={{
                width: 42,
                height: 42,
                background: '#F2F4F7',
              }}>
              <IconifyIcon icon="solar:chart-square-bold-duotone" className="fs-22 text-primary" />
            </div>

            <div>
              <CardTitle as="h5" className="mb-1 fw-semibold">
                Homepage Counter
              </CardTitle>

              <p className="text-muted small mb-0">Manage website statistics displayed to users.</p>
            </div>
          </div>

          {!isEditing && !isLoading && !isError && (
            <Button variant="primary" size="sm" className="d-flex align-items-center gap-1 px-3" onClick={() => setIsEditing(true)}>
              <IconifyIcon icon="solar:pen-2-broken" className="fs-17" />
              Edit Counter
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Body */}
      <CardBody className="p-3 p-md-4">
        {/* Loading */}
        {isLoading && (
          <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: 180 }}>
            <Spinner animation="border" variant="primary" />

            <p className="text-muted small mt-3 mb-0">Loading counter details...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            className="d-flex align-items-center gap-3 rounded-3 p-3"
            style={{
              background: '#FFF4F4',
              border: '1px solid #FFD5D5',
            }}>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{
                width: 40,
                height: 40,
                background: '#FFE3E3',
              }}>
              <IconifyIcon icon="solar:danger-triangle-bold-duotone" className="fs-22 text-danger" />
            </div>

            <div>
              <h6 className="mb-1">Unable to load counter</h6>
              <p className="text-muted small mb-0">Please refresh the page and try again.</p>
            </div>
          </div>
        )}

        {/* View Mode */}
        {!isLoading && !isError && !isEditing && (
          <Row className="g-3">
            {counterItems.map((item) => (
              <Col xs={12} md={6} xl={4} key={item.title}>
                <div
                  className="h-100 rounded-3 p-3 p-lg-4"
                  style={{
                    border: '1px solid #EAECF0',
                    background: '#FFFFFF',
                    transition: 'all .2s ease',
                  }}>
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div className="flex-grow-1">
                      <p
                        className="text-muted mb-2"
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                        }}>
                        {item.title}
                      </p>

                      <h3
                        className="fw-bold mb-1"
                        style={{
                          fontSize: 'clamp(24px, 3vw, 30px)',
                          letterSpacing: '-0.5px',
                        }}>
                        {item.value || '—'}
                      </h3>

                      <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                        {item.description}
                      </p>
                    </div>

                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                      style={{
                        width: 46,
                        height: 46,
                        background: item.iconBg,
                        color: item.iconColor,
                      }}>
                      <IconifyIcon icon={item.icon} className="fs-24" />
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* Edit Mode */}
        {!isLoading && !isError && isEditing && (
          <div>
            <div
              className="d-flex align-items-start gap-2 rounded-3 p-3 mb-4"
              style={{
                background: '#F8FAFC',
                border: '1px solid #EAECF0',
              }}>
              <IconifyIcon icon="solar:info-circle-bold-duotone" className="fs-20 text-primary flex-shrink-0 mt-1" />

              <div>
                <div className="fw-medium small mb-1">Update counter details</div>

                <div className="text-muted" style={{ fontSize: 12 }}>
                  You can use values such as 10,000+, 5,000+ or 12+.
                </div>
              </div>
            </div>

            <Row className="g-3">
              {/* Mobile Verified */}
              <Col xs={12} md={6} xl={4}>
                <Form.Group>
                  <Form.Label className="fw-medium small">
                    Mobile Verified Profiles
                    <span className="text-danger ms-1">*</span>
                  </Form.Label>

                  <div className="position-relative">
                    <div
                      className="position-absolute top-50 translate-middle-y d-flex align-items-center justify-content-center"
                      style={{
                        left: 13,
                        zIndex: 5,
                        pointerEvents: 'none',
                      }}>
                      <IconifyIcon icon="solar:smartphone-2-linear" className="fs-19 text-muted" />
                    </div>

                    <Form.Control
                      type="text"
                      value={mobileVerifiedProfiles}
                      onChange={(e) => setMobileVerifiedProfiles(e.target.value)}
                      placeholder="Example: 10,000+"
                      className="ps-5"
                      style={{
                        minHeight: 44,
                      }}
                    />
                  </div>

                  <Form.Text className="text-muted">Total verified profiles.</Form.Text>
                </Form.Group>
              </Col>

              {/* Customer Served */}
              <Col xs={12} md={6} xl={4}>
                <Form.Group>
                  <Form.Label className="fw-medium small">
                    Customers Served
                    <span className="text-danger ms-1">*</span>
                  </Form.Label>

                  <div className="position-relative">
                    <div
                      className="position-absolute top-50 translate-middle-y d-flex align-items-center justify-content-center"
                      style={{
                        left: 13,
                        zIndex: 5,
                        pointerEvents: 'none',
                      }}>
                      <IconifyIcon icon="solar:users-group-rounded-linear" className="fs-19 text-muted" />
                    </div>

                    <Form.Control
                      type="text"
                      value={customersServed}
                      onChange={(e) => setCustomersServed(e.target.value)}
                      placeholder="Example: 5,000+"
                      className="ps-5"
                      style={{
                        minHeight: 44,
                      }}
                    />
                  </div>

                  <Form.Text className="text-muted">Total customers served.</Form.Text>
                </Form.Group>
              </Col>

              {/* Matchmaking Years */}
              <Col xs={12} md={6} xl={4}>
                <Form.Group>
                  <Form.Label className="fw-medium small">
                    Successful Matchmaking Years
                    <span className="text-danger ms-1">*</span>
                  </Form.Label>

                  <div className="position-relative">
                    <div
                      className="position-absolute top-50 translate-middle-y d-flex align-items-center justify-content-center"
                      style={{
                        left: 13,
                        zIndex: 5,
                        pointerEvents: 'none',
                      }}>
                      <IconifyIcon icon="solar:heart-linear" className="fs-19 text-muted" />
                    </div>

                    <Form.Control
                      type="text"
                      value={successfulMatchmakingYears}
                      onChange={(e) => setSuccessfulMatchmakingYears(e.target.value)}
                      placeholder="Example: 10+"
                      className="ps-5"
                      style={{
                        minHeight: 44,
                      }}
                    />
                  </div>

                  <Form.Text className="text-muted">Years of matchmaking experience.</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}
      </CardBody>

      {/* Footer */}
      {isEditing && (
        <CardFooter className="bg-white border-top px-3 px-md-4 py-3">
          <div className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={handleCancel} disabled={isSaving} className="border px-3">
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
              className="d-flex align-items-center justify-content-center gap-2 px-4"
              style={{
                minWidth: 115,
              }}>
              {isSaving ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Saving...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:diskette-bold-duotone" className="fs-18" />
                  Save
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default CounterEditor
