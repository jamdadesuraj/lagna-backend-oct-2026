'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'react-bootstrap'

import { useGetDownloadApkQuery, useSaveDownloadApkMutation } from '../../../../../store/downloadApkApi'

const DownloadApk = () => {
  const { data: downloadApkRes, isLoading: isFetching } = useGetDownloadApkQuery()

  const [saveDownloadApk, { isLoading: isSaving }] = useSaveDownloadApkMutation()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [googlePlayUrl, setGooglePlayUrl] = useState('')
  const [appStoreUrl, setAppStoreUrl] = useState('')

  const [qrCode, setQrCode] = useState<File | null>(null)
  const [qrCodePreview, setQrCodePreview] = useState<string>('')

  const [apkImage, setApkImage] = useState<File | null>(null)
  const [apkImagePreview, setApkImagePreview] = useState<string>('')

  const [errorMessage, setErrorMessage] = useState<string>('')

  // ==================================================
  // PREFILL FROM EXISTING SETTINGS
  // ==================================================
  useEffect(() => {
    const existing = downloadApkRes?.data

    if (!existing) return

    setTitle(existing.title ?? '')
    setSubtitle(existing.subtitle ?? '')
    setGooglePlayUrl(existing.googlePlayUrl ?? '')
    setAppStoreUrl(existing.appStoreUrl ?? '')

    if (existing.qrCode) {
      setQrCodePreview(existing.qrCode)
    }

    if (existing.apkImage) {
      setApkImagePreview(existing.apkImage)
    }
  }, [downloadApkRes])

  // ==================================================
  // QR CODE IMAGE
  // ==================================================
  const handleQrCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setQrCode(file)

    const previewUrl = URL.createObjectURL(file)

    setQrCodePreview(previewUrl)
  }

  // ==================================================
  // APK IMAGE
  // ==================================================
  const handleApkImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setApkImage(file)

    const previewUrl = URL.createObjectURL(file)

    setApkImagePreview(previewUrl)
  }

  // ==================================================
  // REMOVE QR
  // ==================================================
  const handleRemoveQr = () => {
    setQrCode(null)
    setQrCodePreview('')
  }

  // ==================================================
  // REMOVE APK IMAGE
  // ==================================================
  const handleRemoveApkImage = () => {
    setApkImage(null)
    setApkImagePreview('')
  }

  // ==================================================
  // SUBMIT
  // ==================================================
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErrorMessage('')

    const formData = new FormData()

    formData.append('title', title)
    formData.append('subtitle', subtitle)
    formData.append('googlePlayUrl', googlePlayUrl)
    formData.append('appStoreUrl', appStoreUrl)

    if (qrCode) {
      formData.append('qrCode', qrCode)
    }

    if (apkImage) {
      formData.append('apkImage', apkImage)
    }

    try {
      await saveDownloadApk(formData).unwrap()
    } catch (error) {
      console.error('Save Download APK error:', error)

      setErrorMessage('Failed to save changes. Please try again.')
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <CardTitle as="h4" className="mb-1">
            Download APK
          </CardTitle>

          <p className="text-muted mb-0 fs-13">Manage app download section, store links and QR code.</p>
        </div>
      </CardHeader>

      {/* ================= FORM ================= */}
      <CardBody>
        {isFetching ? (
          <div className="text-center py-5">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {errorMessage && <div className="alert alert-danger py-2 px-3 mb-3">{errorMessage}</div>}

            <Row className="g-3">
              {/* ================= TITLE ================= */}
              <Col lg={6}>
                <Form.Group>
                  <Form.Label>
                    Title
                    <span className="text-danger ms-1">*</span>
                  </Form.Label>

                  <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </Form.Group>
              </Col>

              {/* ================= SUBTITLE ================= */}
              <Col lg={6}>
                <Form.Group>
                  <Form.Label>Subtitle</Form.Label>

                  <Form.Control type="text" placeholder="Enter subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                </Form.Group>
              </Col>

              {/* ================= GOOGLE PLAY URL ================= */}
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
                      placeholder="https://play.google.com/store/apps/..."
                      className="ps-5"
                      value={googlePlayUrl}
                      onChange={(e) => setGooglePlayUrl(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Col>

              {/* ================= APP STORE URL ================= */}
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
                      placeholder="https://apps.apple.com/..."
                      className="ps-5"
                      value={appStoreUrl}
                      onChange={(e) => setAppStoreUrl(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Col>

              {/* ================= QR CODE ================= */}
              <Col lg={6}>
                <Form.Group>
                  <Form.Label>QR Code</Form.Label>

                  <div className="border rounded p-3">
                    {qrCodePreview ? (
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="border rounded bg-light d-flex align-items-center justify-content-center overflow-hidden"
                          style={{
                            width: '100px',
                            height: '100px',
                          }}>
                          <Image
                            src={qrCodePreview}
                            alt="QR Code"
                            width={100}
                            height={100}
                            unoptimized
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </div>

                        <div className="flex-grow-1">
                          <p className="mb-1 fw-medium">{qrCode?.name ?? 'Current QR Code'}</p>

                          <small className="text-muted d-block mb-2">QR Code Preview</small>

                          <button type="button" className="btn btn-soft-danger btn-sm" onClick={handleRemoveQr}>
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <IconifyIcon icon="solar:qr-code-bold-duotone" className="fs-32 text-muted mb-2" />

                        <p className="mb-2 fw-medium">Upload QR Code</p>

                        <small className="text-muted d-block mb-3">PNG, JPG or WEBP</small>

                        <Form.Control type="file" accept="image/png,image/jpeg,image/webp" onChange={handleQrCodeChange} />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              {/* ================= APK IMAGE ================= */}
              <Col lg={6}>
                <Form.Group>
                  <Form.Label>APK Image</Form.Label>

                  <div className="border rounded p-3">
                    {apkImagePreview ? (
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="border rounded bg-light d-flex align-items-center justify-content-center overflow-hidden"
                          style={{
                            width: '100px',
                            height: '100px',
                          }}>
                          <Image
                            src={apkImagePreview}
                            alt="APK"
                            width={100}
                            height={100}
                            unoptimized
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>

                        <div className="flex-grow-1">
                          <p className="mb-1 fw-medium">{apkImage?.name ?? 'Current APK Image'}</p>

                          <small className="text-muted d-block mb-2">APK Image Preview</small>

                          <button type="button" className="btn btn-soft-danger btn-sm" onClick={handleRemoveApkImage}>
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <IconifyIcon icon="solar:gallery-add-bold-duotone" className="fs-32 text-muted mb-2" />

                        <p className="mb-2 fw-medium">Upload APK Image</p>

                        <small className="text-muted d-block mb-3">PNG, JPG or WEBP</small>

                        <Form.Control type="file" accept="image/png,image/jpeg,image/webp" onChange={handleApkImageChange} />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              {/* ================= BUTTON ================= */}
              <Col xs={12}>
                <div className="d-flex justify-content-end pt-2">
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-1" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <IconifyIcon icon="solar:diskette-bold-duotone" className="me-1 fs-18" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </CardBody>
    </Card>
  )
}

export default DownloadApk
