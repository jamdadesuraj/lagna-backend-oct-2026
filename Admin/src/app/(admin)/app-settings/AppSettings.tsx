'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Form, Row } from 'react-bootstrap'
import { useGetAppSettingsQuery, useUpdateAppSettingsMutation } from '../../../../store/appSettingsApi'

const AppSettings = () => {
  // ==================================================
  // RTK QUERY
  // ==================================================
  const { data, isLoading } = useGetAppSettingsQuery()
  const [updateAppSettings, { isLoading: isSaving }] = useUpdateAppSettingsMutation()

  // ==================================================
  // BASIC DETAILS
  // ==================================================
  const [appName, setAppName] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [whatsappNo, setWhatsappNo] = useState('')

  const [supportEmail, setSupportEmail] = useState('')

  const [businessEmail, setBusinessEmail] = useState('')

  const [websiteUrl, setWebsiteUrl] = useState('')

  const [address, setAddress] = useState('')

  // ==================================================
  // STORE LINKS
  // ==================================================
  const [googlePlayUrl, setGooglePlayUrl] = useState('')

  const [appStoreUrl, setAppStoreUrl] = useState('')

  // ==================================================
  // FOOTER / SUPPORT
  // ==================================================
  const [supportHours, setSupportHours] = useState('')

  const [copyrightText, setCopyrightText] = useState('')

  // ==================================================
  // SOCIAL LINKS
  // ==================================================
  const [facebookUrl, setFacebookUrl] = useState('')

  const [instagramUrl, setInstagramUrl] = useState('')

  const [youtubeUrl, setYoutubeUrl] = useState('')

  const [linkedinUrl, setLinkedinUrl] = useState('')

  // ==================================================
  // APP LOGO
  // ==================================================
  const [appLogo, setAppLogo] = useState<File | null>(null)

  const [appLogoPreview, setAppLogoPreview] = useState('')

  // ==================================================
  // PREFILL FORM FROM GET RESPONSE
  // ==================================================
  useEffect(() => {
    if (!data?.data) return

    const s = data.data

    setAppName(s.appName ?? '')
    setMobileNo(s.mobileNo ?? '')
    setWhatsappNo(s.whatsappNo ?? '')
    setSupportEmail(s.supportEmail ?? '')
    setBusinessEmail(s.businessEmail ?? '')
    setWebsiteUrl(s.websiteUrl ?? '')
    setAddress(s.address ?? '')
    setGooglePlayUrl(s.googlePlayUrl ?? '')
    setAppStoreUrl(s.appStoreUrl ?? '')
    setSupportHours(s.supportHours ?? '')
    setCopyrightText(s.copyrightText ?? '')
    setFacebookUrl(s.facebookUrl ?? '')
    setInstagramUrl(s.instagramUrl ?? '')
    setYoutubeUrl(s.youtubeUrl ?? '')
    setLinkedinUrl(s.linkedinUrl ?? '')

    if (s.appLogo) {
      setAppLogoPreview(s.appLogo)
    }
  }, [data])

  // ==================================================
  // LOGO CHANGE
  // ==================================================
  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setAppLogo(file)

    if (appLogoPreview) {
      URL.revokeObjectURL(appLogoPreview)
    }

    setAppLogoPreview(URL.createObjectURL(file))
  }

  // ==================================================
  // REMOVE LOGO
  // ==================================================
  const handleRemoveLogo = () => {
    if (appLogoPreview) {
      URL.revokeObjectURL(appLogoPreview)
    }

    setAppLogo(null)
    setAppLogoPreview('')
  }

  // ==================================================
  // SUBMIT
  // ==================================================
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await updateAppSettings({
        appName,
        mobileNo,
        whatsappNo,
        supportEmail,
        businessEmail,
        websiteUrl,
        address,
        googlePlayUrl,
        appStoreUrl,
        supportHours,
        copyrightText,
        facebookUrl,
        instagramUrl,
        youtubeUrl,
        linkedinUrl,
        appLogo: appLogo ?? undefined,
      }).unwrap()

      // e.g. toast.success('Settings saved successfully')
    } catch (err) {
      // e.g. toast.error('Failed to save settings')
    }
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardBody>Loading...</CardBody>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <CardTitle as="h4" className="mb-1">
            App Settings
          </CardTitle>

          <p className="text-muted fs-13 mb-0">Manage application information, contact details, store links and social profiles.</p>
        </div>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit}>
          {/* ==================================================
              BASIC APP DETAILS
          ================================================== */}
          <Card className="border shadow-none mb-4">
            <CardBody>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: 36,
                    height: 36,
                  }}>
                  <IconifyIcon icon="solar:smartphone-bold-duotone" className="fs-18" />
                </div>

                <div>
                  <h5 className="mb-1">Basic App Details</h5>

                  <small className="text-muted">Manage application name and branding.</small>
                </div>
              </div>

              <Row className="g-3">
                {/* APP NAME */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>
                      App Name
                      <span className="text-danger ms-1">*</span>
                    </Form.Label>

                    <Form.Control type="text" placeholder="Enter app name" value={appName} onChange={(e) => setAppName(e.target.value)} required />
                  </Form.Group>
                </Col>

                {/* WEBSITE */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Website URL</Form.Label>

                    <Form.Control type="url" placeholder="https://example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                  </Form.Group>
                </Col>

                {/* APP LOGO */}
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>App Logo</Form.Label>

                    <div className="border rounded-3 p-3">
                      {appLogoPreview ? (
                        <div className="d-flex align-items-center gap-3 flex-wrap">
                          <div
                            className="border rounded-3 bg-light d-flex align-items-center justify-content-center overflow-hidden"
                            style={{
                              width: 110,
                              height: 110,
                            }}>
                            <Image
                              src={appLogoPreview}
                              alt="App Logo"
                              width={110}
                              height={110}
                              unoptimized
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </div>

                          <div>
                            <p className="mb-2 fw-medium">{appLogo?.name}</p>

                            <button type="button" className="btn btn-soft-danger btn-sm" onClick={handleRemoveLogo}>
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                              Remove Logo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Form.Control type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoChange} />

                          <small className="text-muted d-block mt-2">Recommended: Square PNG or WEBP, 512 × 512 px</small>
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              CONTACT DETAILS
          ================================================== */}
          <Card className="border shadow-none mb-4">
            <CardBody>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: 36,
                    height: 36,
                  }}>
                  <IconifyIcon icon="solar:phone-calling-bold-duotone" className="fs-18" />
                </div>

                <div>
                  <h5 className="mb-1">Contact Details</h5>

                  <small className="text-muted">Manage support and business contact information.</small>
                </div>
              </div>

              <Row className="g-3">
                {/* MOBILE */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Mobile Number</Form.Label>

                    <Form.Control type="tel" placeholder="+91 " value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
                  </Form.Group>
                </Col>

                {/* WHATSAPP */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>WhatsApp Number</Form.Label>

                    <Form.Control type="tel" placeholder="+91 " value={whatsappNo} onChange={(e) => setWhatsappNo(e.target.value)} />
                  </Form.Group>
                </Col>

                {/* SUPPORT EMAIL */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Support Email</Form.Label>

                    <Form.Control
                      type="email"
                      placeholder="support@example.com"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                {/* BUSINESS EMAIL */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Business Email</Form.Label>

                    <Form.Control
                      type="email"
                      placeholder="info@example.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                {/* ADDRESS */}
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Office Address</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter complete office address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                {/* SUPPORT HOURS */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Support Hours</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Mon - Sat, 10:00 AM - 7:00 PM"
                      value={supportHours}
                      onChange={(e) => setSupportHours(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              APP STORE LINKS
          ================================================== */}
          <Card className="border shadow-none mb-4">
            <CardBody>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: 36,
                    height: 36,
                  }}>
                  <IconifyIcon icon="solar:download-square-bold-duotone" className="fs-18" />
                </div>

                <div>
                  <h5 className="mb-1">App Store Links</h5>

                  <small className="text-muted">Manage Android and iOS download links.</small>
                </div>
              </div>

              <Row className="g-3">
                {/* PLAY STORE */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Google Play URL</Form.Label>

                    <div className="position-relative">
                      <IconifyIcon
                        icon="logos:google-play-icon"
                        className="position-absolute top-50 start-0 translate-middle-y ms-3 fs-18"
                        style={{
                          zIndex: 2,
                        }}
                      />

                      <Form.Control
                        type="url"
                        className="ps-5"
                        placeholder="https://play.google.com/store/apps/..."
                        value={googlePlayUrl}
                        onChange={(e) => setGooglePlayUrl(e.target.value)}
                      />
                    </div>
                  </Form.Group>
                </Col>

                {/* APP STORE */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>App Store URL</Form.Label>

                    <div className="position-relative">
                      <IconifyIcon
                        icon="ic:baseline-apple"
                        className="position-absolute top-50 start-0 translate-middle-y ms-3 fs-20"
                        style={{
                          zIndex: 2,
                        }}
                      />

                      <Form.Control
                        type="url"
                        className="ps-5"
                        placeholder="https://apps.apple.com/..."
                        value={appStoreUrl}
                        onChange={(e) => setAppStoreUrl(e.target.value)}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              FOOTER SETTINGS
          ================================================== */}
          <Card className="border shadow-none mb-4">
            <CardBody>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: 36,
                    height: 36,
                  }}>
                  <IconifyIcon icon="solar:document-text-bold-duotone" className="fs-18" />
                </div>

                <div>
                  <h5 className="mb-1">Footer Settings</h5>

                  <small className="text-muted">Manage footer and copyright information.</small>
                </div>
              </div>

              <Row className="g-3">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Copyright Text</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="© 2026 App Name. All rights reserved."
                      value={copyrightText}
                      onChange={(e) => setCopyrightText(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              SOCIAL LINKS
          ================================================== */}
          <Card className="border shadow-none mb-4">
            <CardBody>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: 36,
                    height: 36,
                  }}>
                  <IconifyIcon icon="solar:share-circle-bold-duotone" className="fs-18" />
                </div>

                <div>
                  <h5 className="mb-1">Social Links</h5>

                  <small className="text-muted">Manage your social media profile links.</small>
                </div>
              </div>

              <Row className="g-3">
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Facebook URL</Form.Label>

                    <Form.Control
                      type="url"
                      placeholder="https://facebook.com/yourpage"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Instagram URL</Form.Label>

                    <Form.Control
                      type="url"
                      placeholder="https://instagram.com/yourpage"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>YouTube URL</Form.Label>

                    <Form.Control
                      type="url"
                      placeholder="https://youtube.com/yourchannel"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>LinkedIn URL</Form.Label>

                    <Form.Control
                      type="url"
                      placeholder="https://linkedin.com/company/yourpage"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ================= SAVE ================= */}
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              <IconifyIcon icon="solar:diskette-bold-duotone" className="me-1 fs-18" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </Form>
      </CardBody>
    </Card>
  )
}

export default AppSettings
