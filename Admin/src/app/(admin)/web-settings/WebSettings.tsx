'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Form, Row } from 'react-bootstrap'
import { useGetWebSettingsQuery, useUpdateWebSettingsMutation } from '../../../../store/webSettingsApi'

const WebSettings = () => {
  // ==================================================
  // RTK QUERY
  // ==================================================
  const { data, isLoading } = useGetWebSettingsQuery()
  const [updateWebSettings, { isLoading: isSaving }] = useUpdateWebSettingsMutation()

  // ==================================================
  // BASIC WEBSITE DETAILS
  // ==================================================
  const [websiteName, setWebsiteName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [tagline, setTagline] = useState('')

  // ==================================================
  // CONTACT DETAILS
  // ==================================================
  const [mobileNo, setMobileNo] = useState('')
  const [whatsappNo, setWhatsappNo] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [address, setAddress] = useState('')
  const [supportHours, setSupportHours] = useState('')

  // ==================================================
  // SEO
  // ==================================================
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [metaKeywords, setMetaKeywords] = useState('')

  // ==================================================
  // SOCIAL MEDIA
  // ==================================================
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')

  // ==================================================
  // FOOTER
  // ==================================================
  const [copyrightText, setCopyrightText] = useState('')
  const [footerDescription, setFooterDescription] = useState('')

  // ==================================================
  // SYSTEM
  // ==================================================
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // ==================================================
  // LOGO
  // ==================================================
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')

  // ==================================================
  // FAVICON
  // ==================================================
  const [favicon, setFavicon] = useState<File | null>(null)
  const [faviconPreview, setFaviconPreview] = useState('')

  // ==================================================
  // PREFILL FORM FROM GET RESPONSE
  // ==================================================
  useEffect(() => {
    if (!data?.data) return

    const s = data.data

    setWebsiteName(s.websiteName ?? '')
    setWebsiteUrl(s.websiteUrl ?? '')
    setTagline(s.tagline ?? '')

    setMobileNo(s.mobileNo ?? '')
    setWhatsappNo(s.whatsappNo ?? '')
    setSupportEmail(s.supportEmail ?? '')
    setBusinessEmail(s.businessEmail ?? '')
    setAddress(s.address ?? '')
    setSupportHours(s.supportHours ?? '')

    setMetaTitle(s.metaTitle ?? '')
    setMetaDescription(s.metaDescription ?? '')
    setMetaKeywords(s.metaKeywords ?? '')

    setFacebookUrl(s.facebookUrl ?? '')
    setInstagramUrl(s.instagramUrl ?? '')
    setYoutubeUrl(s.youtubeUrl ?? '')
    setLinkedinUrl(s.linkedinUrl ?? '')
    setTwitterUrl(s.twitterUrl ?? '')

    setCopyrightText(s.copyrightText ?? '')
    setFooterDescription(s.footerDescription ?? '')

    setMaintenanceMode(s.maintenanceMode ?? false)

    if (s.logo) setLogoPreview(s.logo)
    if (s.favicon) setFaviconPreview(s.favicon)
  }, [data])

  // ==================================================
  // LOGO CHANGE
  // ==================================================
  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
    }

    setLogo(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  // ==================================================
  // FAVICON CHANGE
  // ==================================================
  const handleFaviconChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (faviconPreview) {
      URL.revokeObjectURL(faviconPreview)
    }

    setFavicon(file)
    setFaviconPreview(URL.createObjectURL(file))
  }

  // ==================================================
  // REMOVE LOGO
  // ==================================================
  const handleRemoveLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
    }

    setLogo(null)
    setLogoPreview('')
  }

  // ==================================================
  // REMOVE FAVICON
  // ==================================================
  const handleRemoveFavicon = () => {
    if (faviconPreview) {
      URL.revokeObjectURL(faviconPreview)
    }

    setFavicon(null)
    setFaviconPreview('')
  }

  // ==================================================
  // SUBMIT
  // ==================================================
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await updateWebSettings({
        websiteName,
        websiteUrl,
        tagline,
        mobileNo,
        whatsappNo,
        supportEmail,
        businessEmail,
        address,
        supportHours,
        metaTitle,
        metaDescription,
        metaKeywords,
        facebookUrl,
        instagramUrl,
        youtubeUrl,
        linkedinUrl,
        twitterUrl,
        copyrightText,
        footerDescription,
        maintenanceMode,
        logo: logo ?? undefined,
        favicon: favicon ?? undefined,
      }).unwrap()

      // e.g. toast.success('Website settings saved successfully')
    } catch (err) {
      // e.g. toast.error('Failed to save website settings')
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
            Website Settings
          </CardTitle>

          <p className="text-muted fs-13 mb-0">Manage website information, branding, contact details and SEO settings.</p>
        </div>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit}>
          {/* ==================================================
              BRANDING
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
                  <IconifyIcon icon="solar:gallery-bold-duotone" className="fs-18" />
                </div>

                <div>
                  <h5 className="mb-1">Branding</h5>

                  <small className="text-muted">Manage website logo and favicon.</small>
                </div>
              </div>

              <Row className="g-3">
                {/* LOGO */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Website Logo</Form.Label>

                    <div className="border rounded-3 p-3">
                      {logoPreview ? (
                        <div className="d-flex align-items-center gap-3 flex-wrap">
                          <div
                            className="border rounded bg-light d-flex align-items-center justify-content-center overflow-hidden"
                            style={{
                              width: 150,
                              height: 90,
                            }}>
                            <Image
                              src={logoPreview}
                              alt="Website Logo"
                              width={150}
                              height={90}
                              unoptimized
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </div>

                          <div>
                            <p className="mb-2 fw-medium">{logo?.name}</p>

                            <button type="button" className="btn btn-soft-danger btn-sm" onClick={handleRemoveLogo}>
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Form.Control type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoChange} />

                          <small className="text-muted d-block mt-2">Recommended: PNG / WEBP transparent logo</small>
                        </>
                      )}
                    </div>
                  </Form.Group>
                </Col>

                {/* FAVICON */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Favicon</Form.Label>

                    <div className="border rounded-3 p-3">
                      {faviconPreview ? (
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="border rounded bg-light d-flex align-items-center justify-content-center overflow-hidden"
                            style={{
                              width: 90,
                              height: 90,
                            }}>
                            <Image
                              src={faviconPreview}
                              alt="Favicon"
                              width={90}
                              height={90}
                              unoptimized
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </div>

                          <button type="button" className="btn btn-soft-danger btn-sm" onClick={handleRemoveFavicon}>
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Form.Control type="file" accept="image/png,image/x-icon,image/webp" onChange={handleFaviconChange} />

                          <small className="text-muted d-block mt-2">Recommended: 512 × 512 px</small>
                        </>
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

                  <small className="text-muted">Manage website support details.</small>
                </div>
              </div>

              <Row className="g-3">
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Mobile Number</Form.Label>

                    <Form.Control type="tel" placeholder="+91 9876543210" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>WhatsApp Number</Form.Label>

                    <Form.Control type="tel" placeholder="+91 9876543210" value={whatsappNo} onChange={(e) => setWhatsappNo(e.target.value)} />
                  </Form.Group>
                </Col>

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

                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Support Hours</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Mon - Sat, 10 AM - 7 PM"
                      value={supportHours}
                      onChange={(e) => setSupportHours(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Office Address</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter office address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              SEO SETTINGS
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
                  <IconifyIcon icon="solar:magnifer-bold-duotone" className="fs-18" />
                </div>

                <div>
                  <h5 className="mb-1">SEO Settings</h5>

                  <small className="text-muted">Default SEO metadata for the website.</small>
                </div>
              </div>

              <Row className="g-3">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Meta Title</Form.Label>

                    <Form.Control type="text" placeholder="Enter meta title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Meta Description</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter meta description"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Meta Keywords</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="matrimony, marriage, matches"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                    />

                    <small className="text-muted">Separate keywords with commas.</small>
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              SOCIAL MEDIA
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
                  <h5 className="mb-1">Social Media</h5>

                  <small className="text-muted">Manage official social links.</small>
                </div>
              </div>

              <Row className="g-3">
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Facebook URL</Form.Label>

                    <Form.Control
                      type="url"
                      placeholder="https://facebook.com/..."
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
                      placeholder="https://instagram.com/..."
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
                      placeholder="https://youtube.com/..."
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
                      placeholder="https://linkedin.com/..."
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>X / Twitter URL</Form.Label>

                    <Form.Control type="url" placeholder="https://x.com/..." value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              FOOTER
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

                  <small className="text-muted">Manage website footer content.</small>
                </div>
              </div>

              <Row className="g-3">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Footer Description</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter footer description"
                      value={footerDescription}
                      onChange={(e) => setFooterDescription(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Copyright Text</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="© 2026 Website Name. All rights reserved."
                      value={copyrightText}
                      onChange={(e) => setCopyrightText(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              SYSTEM
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
                  <IconifyIcon icon="solar:settings-bold-duotone" className="fs-18" />
                </div>

                <div>
                  <h5 className="mb-1">System</h5>

                  <small className="text-muted">Control site-wide availability.</small>
                </div>
              </div>

              <Row className="g-3">
                <Col xs={12}>
                  <Form.Check
                    type="switch"
                    id="maintenance-mode-switch"
                    label="Maintenance Mode"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                  />
                  <small className="text-muted d-block mt-1">When enabled, visitors will see a maintenance page instead of the website.</small>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ================= SAVE ================= */}
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              <IconifyIcon icon="solar:diskette-bold-duotone" className="me-1 fs-18" />
              {isSaving ? 'Saving...' : 'Save Website Settings'}
            </button>
          </div>
        </Form>
      </CardBody>
    </Card>
  )
}

export default WebSettings
