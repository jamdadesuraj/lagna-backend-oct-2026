'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useGetCareersQuery, useSaveCareersMutation, useRemoveCareerImageMutation } from '../../../../../store/careersApi'

type CareerImage = {
  file: File
  preview: string
}

const Careers = () => {
  // ==================================================
  // API HOOKS
  // ==================================================
  const { data: careersRes, isLoading: isFetching } = useGetCareersQuery()
  const [saveCareers, { isLoading: isSaving }] = useSaveCareersMutation()
  const [removeCareerImage, { isLoading: isRemovingImage }] = useRemoveCareerImageMutation()

  // ==================================================
  // FORM STATES
  // ==================================================
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')

  const [images, setImages] = useState<CareerImage[]>([])

  // Already-saved gallery images fetched from the server (Cloudinary URLs)
  const existingImages = careersRes?.data?.images ?? []

  // Only seed the form from the fetched document once, so we don't clobber
  // whatever the admin is currently typing on background refetches.
  const hasSeededRef = useRef(false)

  useEffect(() => {
    if (hasSeededRef.current) return
    if (!careersRes?.data) return

    setTitle(careersRes.data.title ?? '')
    setSubtitle(careersRes.data.subtitle ?? '')
    hasSeededRef.current = true
  }, [careersRes])

  // ==================================================
  // MULTIPLE IMAGE UPLOAD
  // ==================================================
  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) return

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...newImages])

    // allow same image selection again
    event.target.value = ''
  }

  // ==================================================
  // REMOVE SINGLE IMAGE (not yet saved)
  // ==================================================
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const selectedImage = prev[index]

      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview)
      }

      return prev.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  // ==================================================
  // REMOVE ALL IMAGES (not yet saved)
  // ==================================================
  const handleRemoveAllImages = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview)
    })

    setImages([])
  }

  // ==================================================
  // REMOVE AN ALREADY-SAVED IMAGE (hits the API)
  // ==================================================
  const handleRemoveExistingImage = async (image: string) => {
    if (!confirm('Remove this image from the careers gallery?')) return

    try {
      await removeCareerImage({ image }).unwrap()
    } catch {
      alert('Failed to remove image. Please try again.')
    }
  }

  // ==================================================
  // CLEAN PREVIEW URLS
  // ==================================================
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview)
      })
    }
  }, [])

  // ==================================================
  // SUBMIT
  // ==================================================
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData()

    formData.append('title', title)
    formData.append('subtitle', subtitle)

    images.forEach((image) => {
      formData.append('images', image.file)
    })

    try {
      await saveCareers({ formData }).unwrap()

      // New images are now persisted on the server (and will come back via
      // existingImages on refetch), so clear the local "pending upload" list.
      images.forEach((image) => URL.revokeObjectURL(image.preview))
      setImages([])
    } catch {
      alert('Failed to save careers page. Please try again.')
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <CardTitle as="h4" className="mb-1">
            Careers
          </CardTitle>

          <p className="text-muted fs-13 mb-0">Manage career page title, subtitle and gallery images.</p>
        </div>

        {isFetching && <Spinner animation="border" size="sm" />}
      </CardHeader>

      {/* ================= BODY ================= */}
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* ================= CONTENT ================= */}
            <Col xs={12}>
              <div className="border rounded-3 p-3 p-lg-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 36,
                      height: 36,
                    }}>
                    <IconifyIcon icon="solar:text-square-bold-duotone" className="fs-18" />
                  </div>

                  <div>
                    <h5 className="mb-1">Page Content</h5>

                    <small className="text-muted">Manage main heading and supporting text.</small>
                  </div>
                </div>

                <Row className="g-3">
                  {/* TITLE */}
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>
                        Title
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>

                      <Form.Control type="text" placeholder="Enter careers title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </Form.Group>
                  </Col>

                  {/* SUBTITLE */}
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Subtitle</Form.Label>

                      <Form.Control type="text" placeholder="Enter careers subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* ================= EXISTING (SAVED) IMAGES ================= */}
            {existingImages.length > 0 && (
              <Col xs={12}>
                <div className="border rounded-3 p-3 p-lg-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div
                      className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 36,
                        height: 36,
                      }}>
                      <IconifyIcon icon="solar:gallery-check-bold-duotone" className="fs-18" />
                    </div>

                    <div>
                      <h5 className="mb-1">Saved Images</h5>

                      <small className="text-muted">Already uploaded to the careers page. Removing here is immediate.</small>
                    </div>
                  </div>

                  <Row className="g-3">
                    {existingImages.map((imageUrl, index) => (
                      <Col key={imageUrl} xxl={3} xl={4} lg={4} md={6} xs={12}>
                        <div className="border rounded-3 overflow-hidden h-100">
                          <div
                            className="position-relative bg-light"
                            style={{
                              height: 180,
                            }}>
                            <Image
                              src={imageUrl}
                              alt={`Saved career image ${index + 1}`}
                              fill
                              unoptimized
                              style={{
                                objectFit: 'cover',
                              }}
                            />

                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
                              style={{
                                width: 30,
                                height: 30,
                                padding: 0,
                                zIndex: 5,
                              }}
                              disabled={isRemovingImage}
                              onClick={() => handleRemoveExistingImage(imageUrl)}
                              title="Remove Image">
                              {isRemovingImage ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16" />
                              )}
                            </button>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
            )}

            {/* ================= MULTIPLE IMAGES ================= */}
            <Col xs={12}>
              <div className="border rounded-3 p-3 p-lg-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 36,
                        height: 36,
                      }}>
                      <IconifyIcon icon="solar:gallery-wide-bold-duotone" className="fs-18" />
                    </div>

                    <div>
                      <h5 className="mb-1">Career Images</h5>

                      <small className="text-muted">Upload multiple images for the careers page.</small>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <button type="button" className="btn btn-soft-danger btn-sm" onClick={handleRemoveAllImages}>
                      <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1 fs-16" />
                      Remove All
                    </button>
                  )}
                </div>

                {/* UPLOAD */}
                <div
                  className="border border-dashed rounded-3 p-4 text-center mb-3"
                  style={{
                    background: 'var(--bs-light)',
                  }}>
                  <IconifyIcon icon="solar:gallery-add-bold-duotone" className="fs-36 text-primary mb-2" />

                  <h6 className="mb-1">Upload Images</h6>

                  <p className="text-muted fs-13 mb-3">Select one or multiple PNG, JPG or WEBP images.</p>

                  <Form.Control type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={handleImagesChange} />
                </div>

                {/* IMAGE COUNT */}
                {images.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted">
                      {images.length} image
                      {images.length !== 1 ? 's' : ''} selected
                    </small>
                  </div>
                )}

                {/* PREVIEWS */}
                {images.length > 0 && (
                  <Row className="g-3">
                    {images.map((image, index) => (
                      <Col key={`${image.file.name}-${index}`} xxl={3} xl={4} lg={4} md={6} xs={12}>
                        <div className="border rounded-3 overflow-hidden h-100">
                          {/* IMAGE */}
                          <div
                            className="position-relative bg-light"
                            style={{
                              height: 180,
                            }}>
                            <Image
                              src={image.preview}
                              alt={`Career image ${index + 1}`}
                              fill
                              unoptimized
                              style={{
                                objectFit: 'cover',
                              }}
                            />

                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
                              style={{
                                width: 30,
                                height: 30,
                                padding: 0,
                                zIndex: 5,
                              }}
                              onClick={() => handleRemoveImage(index)}
                              title="Remove Image">
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16" />
                            </button>
                          </div>

                          {/* IMAGE INFO */}
                          <div className="p-2">
                            <p className="mb-1 text-truncate fw-medium" title={image.file.name}>
                              {image.file.name}
                            </p>

                            <small className="text-muted">{(image.file.size / 1024 / 1024).toFixed(2)} MB</small>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </Col>

            {/* ================= SAVE ================= */}
            <Col xs={12}>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? (
                    <Spinner animation="border" size="sm" className="me-1" />
                  ) : (
                    <IconifyIcon icon="solar:diskette-bold-duotone" className="me-1 fs-18" />
                  )}
                  Save Careers
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}

export default Careers
