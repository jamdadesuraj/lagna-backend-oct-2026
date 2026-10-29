'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'react-bootstrap'

import { useGetAboutUsQuery, useSaveAboutUsMutation } from '../../../../../store/manage-about-usApi'
type StatItem = {
  value: string
  label: string
}

type AwardItem = {
  title: string
  subtitle: string
  year: string
}

type StepItem = {
  title: string
  description: string
}

// ==================================================
// IMAGE UPLOAD FIELD
// ==================================================
const ImageUploadField = ({
  label,
  preview,
  onChange,
  onRemove,
  recommended,
}: {
  label: string
  preview: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
  recommended?: string
}) => {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>

      <div className="border rounded-3 p-3 bg-light-subtle">
        {preview ? (
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div
              className="border rounded-3 bg-white overflow-hidden d-flex align-items-center justify-content-center"
              style={{
                width: 120,
                height: 90,
              }}>
              <Image
                src={preview}
                alt={label}
                width={120}
                height={90}
                unoptimized
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            <div>
              <button type="button" className="btn btn-soft-danger btn-sm" onClick={onRemove}>
                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1 fs-16" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <Form.Control type="file" accept="image/png,image/jpeg,image/webp" onChange={onChange} />

            {recommended && <small className="text-muted d-block mt-2">Recommended: {recommended}</small>}
          </>
        )}
      </div>
    </Form.Group>
  )
}

// ==================================================
// SECTION HEADER
// ==================================================
const SectionHeader = ({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) => {
  return (
    <div className="d-flex align-items-start gap-2 mb-3">
      <div
        className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: 36,
          height: 36,
        }}>
        <IconifyIcon icon={icon} className="fs-18" />
      </div>

      <div>
        <h5 className="mb-1">{title}</h5>

        <p className="text-muted fs-13 mb-0">{subtitle}</p>
      </div>
    </div>
  )
}

// ==================================================
// ABOUT US
// ==================================================
const AboutUs = () => {
  const { data: aboutUsRes, isLoading: isFetching } = useGetAboutUsQuery()

  const [saveAboutUs, { isLoading: isSaving }] = useSaveAboutUsMutation()

  const [errorMessage, setErrorMessage] = useState('')

  // ==================================================
  // HERO
  // ==================================================
  const [heroBadge, setHeroBadge] = useState('ABOUT US')

  const [heroTitle, setHeroTitle] = useState('Building Trust Through')

  const [heroHighlightedTitle, setHeroHighlightedTitle] = useState('Meaningful Connections')

  const [heroDescription, setHeroDescription] = useState('')

  const [heroBadgeText, setHeroBadgeText] = useState('8,000+ happy marriages and counting')

  const [heroImage, setHeroImage] = useState<File | null>(null)

  const [heroPreview, setHeroPreview] = useState('')

  // ==================================================
  // CEO
  // ==================================================
  const [ceoSectionTitle, setCeoSectionTitle] = useState('Letter From Our CEO')

  const [ceoName, setCeoName] = useState('')

  const [ceoDesignation, setCeoDesignation] = useState('Founder & CEO')

  const [ceoLetter, setCeoLetter] = useState('')

  const [ceoImage, setCeoImage] = useState<File | null>(null)

  const [ceoPreview, setCeoPreview] = useState('')

  // ==================================================
  // MISSION & VISION
  // ==================================================
  const [missionVisionTitle, setMissionVisionTitle] = useState('Mission & Vision')

  const [missionTitle, setMissionTitle] = useState('Our Mission')

  const [missionDescription, setMissionDescription] = useState('')

  const [visionTitle, setVisionTitle] = useState('Our Vision')

  const [visionDescription, setVisionDescription] = useState('')

  // ==================================================
  // ABOUT US SECTION
  // ==================================================
  const [aboutSectionTitle, setAboutSectionTitle] = useState('About Us')

  const [aboutDescription, setAboutDescription] = useState('')

  const [aboutImage, setAboutImage] = useState<File | null>(null)

  const [aboutPreview, setAboutPreview] = useState('')

  const [stats, setStats] = useState<StatItem[]>([
    {
      value: '1L+',
      label: 'Verified Profiles',
    },
    {
      value: '45,000+',
      label: 'Successful Matches',
    },
    {
      value: '500+',
      label: 'Cities Covered',
    },
    {
      value: '8+',
      label: 'Years of Trust',
    },
  ])

  // ==================================================
  // AWARDS
  // ==================================================
  const [awardSectionTitle, setAwardSectionTitle] = useState('Award Winners')

  const [awards, setAwards] = useState<AwardItem[]>([
    {
      title: 'Best Matrimony Platform',
      subtitle: 'Marriage Platform Award',
      year: '2025',
    },
    {
      title: 'Excellence in Trust & Safety',
      subtitle: 'Trust & Security Award',
      year: '2024',
    },
    {
      title: 'Most Loved App',
      subtitle: 'Dating & Matrimony Award',
      year: '2023',
    },
    {
      title: 'Fastest Growing Matrimony App',
      subtitle: 'Matrimony Excellence Award',
      year: '2022',
    },
  ])

  // ==================================================
  // HOW TO USE
  // ==================================================
  const [howToTitle, setHowToTitle] = useState('How To Use')

  const [steps, setSteps] = useState<StepItem[]>([
    {
      title: 'Create your profile',
      description: 'Create your profile and add your personal information.',
    },
    {
      title: 'Discover matches',
      description: 'Browse and discover suitable profiles based on your preferences.',
    },
    {
      title: 'Connect securely',
      description: 'Connect with verified matches through a safe platform.',
    },
    {
      title: 'Start your journey',
      description: 'Take the next step toward a meaningful relationship.',
    },
  ])

  // ==================================================
  // PREFILL FROM EXISTING SETTINGS
  // ==================================================
  useEffect(() => {
    const existing = aboutUsRes?.data

    if (!existing) return

    // Hero
    setHeroBadge(existing.heroBadge || 'ABOUT US')
    setHeroTitle(existing.heroTitle || 'Building Trust Through')
    setHeroHighlightedTitle(existing.heroHighlightedTitle || 'Meaningful Connections')
    setHeroDescription(existing.heroDescription || '')
    setHeroBadgeText(existing.heroBadgeText || '8,000+ happy marriages and counting')

    if (existing.heroImage) {
      setHeroPreview(existing.heroImage)
    }

    // CEO
    setCeoSectionTitle(existing.ceoSectionTitle || 'Letter From Our CEO')
    setCeoName(existing.ceoName || '')
    setCeoDesignation(existing.ceoDesignation || 'Founder & CEO')
    setCeoLetter(existing.ceoLetter || '')

    if (existing.ceoImage) {
      setCeoPreview(existing.ceoImage)
    }

    // Mission & Vision
    setMissionVisionTitle(existing.missionVisionTitle || 'Mission & Vision')
    setMissionTitle(existing.missionTitle || 'Our Mission')
    setMissionDescription(existing.missionDescription || '')
    setVisionTitle(existing.visionTitle || 'Our Vision')
    setVisionDescription(existing.visionDescription || '')

    // About
    setAboutSectionTitle(existing.aboutSectionTitle || 'About Us')
    setAboutDescription(existing.aboutDescription || '')

    if (existing.aboutImage) {
      setAboutPreview(existing.aboutImage)
    }

    if (existing.stats?.length) {
      setStats(existing.stats)
    }

    // Awards
    setAwardSectionTitle(existing.awardSectionTitle || 'Award Winners')

    if (existing.awards?.length) {
      setAwards(existing.awards)
    }

    // How To Use
    setHowToTitle(existing.howToTitle || 'How To Use')

    if (existing.steps?.length) {
      setSteps(existing.steps)
    }
  }, [aboutUsRes])

  // ==================================================
  // FILE PREVIEW HELPER
  // ==================================================
  const createPreview = (file: File, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const url = URL.createObjectURL(file)

    setter(url)
  }

  // ==================================================
  // HERO IMAGE
  // ==================================================
  const handleHeroImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setHeroImage(file)
    createPreview(file, setHeroPreview)
  }

  // ==================================================
  // CEO IMAGE
  // ==================================================
  const handleCeoImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setCeoImage(file)
    createPreview(file, setCeoPreview)
  }

  // ==================================================
  // ABOUT IMAGE
  // ==================================================
  const handleAboutImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setAboutImage(file)
    createPreview(file, setAboutPreview)
  }

  // ==================================================
  // STAT FUNCTIONS
  // ==================================================
  const handleStatChange = (index: number, field: keyof StatItem, value: string) => {
    setStats((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )
  }

  const addStat = () => {
    setStats((prev) => [
      ...prev,
      {
        value: '',
        label: '',
      },
    ])
  }

  const removeStat = (index: number) => {
    setStats((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  // ==================================================
  // AWARD FUNCTIONS
  // ==================================================
  const handleAwardChange = (index: number, field: keyof AwardItem, value: string) => {
    setAwards((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )
  }

  const addAward = () => {
    setAwards((prev) => [
      ...prev,
      {
        title: '',
        subtitle: '',
        year: '',
      },
    ])
  }

  const removeAward = (index: number) => {
    setAwards((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  // ==================================================
  // STEP FUNCTIONS
  // ==================================================
  const handleStepChange = (index: number, field: keyof StepItem, value: string) => {
    setSteps((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )
  }

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        title: '',
        description: '',
      },
    ])
  }

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  // ==================================================
  // SUBMIT
  // ==================================================
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErrorMessage('')

    const formData = new FormData()

    // Hero
    formData.append('heroBadge', heroBadge)
    formData.append('heroTitle', heroTitle)
    formData.append('heroHighlightedTitle', heroHighlightedTitle)
    formData.append('heroDescription', heroDescription)
    formData.append('heroBadgeText', heroBadgeText)

    if (heroImage) {
      formData.append('heroImage', heroImage)
    }

    // CEO
    formData.append('ceoSectionTitle', ceoSectionTitle)
    formData.append('ceoName', ceoName)
    formData.append('ceoDesignation', ceoDesignation)
    formData.append('ceoLetter', ceoLetter)

    if (ceoImage) {
      formData.append('ceoImage', ceoImage)
    }

    // Mission & Vision
    formData.append('missionVisionTitle', missionVisionTitle)
    formData.append('missionTitle', missionTitle)
    formData.append('missionDescription', missionDescription)
    formData.append('visionTitle', visionTitle)
    formData.append('visionDescription', visionDescription)

    // About
    formData.append('aboutSectionTitle', aboutSectionTitle)
    formData.append('aboutDescription', aboutDescription)

    if (aboutImage) {
      formData.append('aboutImage', aboutImage)
    }

    formData.append('stats', JSON.stringify(stats))

    // Awards
    formData.append('awardSectionTitle', awardSectionTitle)

    formData.append('awards', JSON.stringify(awards))

    // How To Use
    formData.append('howToTitle', howToTitle)

    formData.append('steps', JSON.stringify(steps))

    try {
      await saveAboutUs(formData).unwrap()
    } catch (error) {
      console.error('Save About Us error:', error)

      setErrorMessage('Failed to save changes. Please try again.')
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <CardTitle as="h4" className="mb-1">
            About Us Management
          </CardTitle>

          <p className="text-muted fs-13 mb-0">Manage all content displayed on the About Us page.</p>
        </div>
      </CardHeader>

      <CardBody>
        {isFetching ? (
          <div className="text-center py-5">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {errorMessage && <div className="alert alert-danger py-2 px-3 mb-3">{errorMessage}</div>}

            {/* ==================================================
                1. HERO SECTION
            ================================================== */}
            <Card className="border mb-4 shadow-none">
              <CardBody>
                <SectionHeader
                  icon="solar:gallery-wide-bold-duotone"
                  title="Hero Section"
                  subtitle="Manage the top heading, description and banner image."
                />

                <Row className="g-3">
                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Section Badge</Form.Label>

                      <Form.Control type="text" placeholder="ABOUT US" value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} />
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Main Title</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Building Trust Through"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Highlighted Title</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Meaningful Connections"
                        value={heroHighlightedTitle}
                        onChange={(e) => setHeroHighlightedTitle(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Intro Description</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter About Us intro description..."
                        value={heroDescription}
                        onChange={(e) => setHeroDescription(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Banner Badge Text</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="8,000+ happy marriages and counting"
                        value={heroBadgeText}
                        onChange={(e) => setHeroBadgeText(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <ImageUploadField
                      label="Hero Banner Image"
                      preview={heroPreview}
                      onChange={handleHeroImage}
                      onRemove={() => {
                        setHeroImage(null)
                        setHeroPreview('')
                      }}
                      recommended="1920 × 700 px"
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* ==================================================
                2. CEO SECTION
            ================================================== */}
            <Card className="border mb-4 shadow-none">
              <CardBody>
                <SectionHeader
                  icon="solar:user-speak-rounded-bold-duotone"
                  title="Letter From CEO"
                  subtitle="Manage CEO profile and introduction message."
                />

                <Row className="g-3">
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Section Title</Form.Label>

                      <Form.Control type="text" value={ceoSectionTitle} onChange={(e) => setCeoSectionTitle(e.target.value)} />
                    </Form.Group>
                  </Col>

                  <Col lg={3}>
                    <Form.Group>
                      <Form.Label>CEO Name</Form.Label>

                      <Form.Control type="text" placeholder="Enter CEO name" value={ceoName} onChange={(e) => setCeoName(e.target.value)} />
                    </Form.Group>
                  </Col>

                  <Col lg={3}>
                    <Form.Group>
                      <Form.Label>Designation</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Founder & CEO"
                        value={ceoDesignation}
                        onChange={(e) => setCeoDesignation(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={8}>
                    <Form.Group>
                      <Form.Label>CEO Message</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={7}
                        placeholder="Enter CEO message..."
                        value={ceoLetter}
                        onChange={(e) => setCeoLetter(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <ImageUploadField
                      label="CEO Image"
                      preview={ceoPreview}
                      onChange={handleCeoImage}
                      onRemove={() => {
                        setCeoImage(null)
                        setCeoPreview('')
                      }}
                      recommended="600 × 800 px"
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* ==================================================
                3. MISSION & VISION
            ================================================== */}
            <Card className="border mb-4 shadow-none">
              <CardBody>
                <SectionHeader icon="solar:target-bold-duotone" title="Mission & Vision" subtitle="Manage mission and vision content." />

                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Section Title</Form.Label>

                      <Form.Control type="text" value={missionVisionTitle} onChange={(e) => setMissionVisionTitle(e.target.value)} />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <div className="border rounded-3 p-3 h-100">
                      <Form.Group className="mb-3">
                        <Form.Label>Mission Title</Form.Label>

                        <Form.Control type="text" value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Mission Description</Form.Label>

                        <Form.Control as="textarea" rows={5} value={missionDescription} onChange={(e) => setMissionDescription(e.target.value)} />
                      </Form.Group>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="border rounded-3 p-3 h-100">
                      <Form.Group className="mb-3">
                        <Form.Label>Vision Title</Form.Label>

                        <Form.Control type="text" value={visionTitle} onChange={(e) => setVisionTitle(e.target.value)} />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Vision Description</Form.Label>

                        <Form.Control as="textarea" rows={5} value={visionDescription} onChange={(e) => setVisionDescription(e.target.value)} />
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* ==================================================
                4. ABOUT US
            ================================================== */}
            <Card className="border mb-4 shadow-none">
              <CardBody>
                <SectionHeader
                  icon="solar:info-circle-bold-duotone"
                  title="About Us Content"
                  subtitle="Manage company introduction, image and statistics."
                />

                <Row className="g-3">
                  <Col lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Section Title</Form.Label>

                      <Form.Control type="text" value={aboutSectionTitle} onChange={(e) => setAboutSectionTitle(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Description</Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={7}
                        placeholder="Enter About Us content..."
                        value={aboutDescription}
                        onChange={(e) => setAboutDescription(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <ImageUploadField
                      label="About Us Image"
                      preview={aboutPreview}
                      onChange={handleAboutImage}
                      onRemove={() => {
                        setAboutImage(null)
                        setAboutPreview('')
                      }}
                      recommended="800 × 500 px"
                    />
                  </Col>

                  {/* ================= STATS ================= */}
                  <Col xs={12}>
                    <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                      <h6 className="mb-0">Statistics</h6>

                      <button type="button" className="btn btn-soft-primary btn-sm" onClick={addStat}>
                        <IconifyIcon icon="solar:add-circle-broken" className="me-1" />
                        Add Stat
                      </button>
                    </div>
                  </Col>

                  {stats.map((stat, index) => (
                    <Col lg={3} md={6} key={index}>
                      <div className="border rounded-3 p-3 h-100 position-relative">
                        <Form.Group className="mb-2">
                          <Form.Label>Value</Form.Label>

                          <Form.Control
                            type="text"
                            placeholder="45,000+"
                            value={stat.value}
                            onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Label</Form.Label>

                          <Form.Control
                            type="text"
                            placeholder="Successful Matches"
                            value={stat.label}
                            onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                          />
                        </Form.Group>

                        {stats.length > 1 && (
                          <button type="button" className="btn btn-soft-danger btn-sm mt-3" onClick={() => removeStat(index)}>
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                            Remove
                          </button>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>

            {/* ==================================================
                5. AWARD WINNERS
            ================================================== */}
            <Card className="border mb-4 shadow-none">
              <CardBody>
                <SectionHeader icon="solar:cup-star-bold-duotone" title="Award Winners" subtitle="Manage awards displayed on the About Us page." />

                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Section Title</Form.Label>

                      <Form.Control type="text" value={awardSectionTitle} onChange={(e) => setAwardSectionTitle(e.target.value)} />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn btn-soft-primary btn-sm" onClick={addAward}>
                        <IconifyIcon icon="solar:add-circle-broken" className="me-1" />
                        Add Award
                      </button>
                    </div>
                  </Col>

                  {awards.map((award, index) => (
                    <Col lg={6} key={index}>
                      <div className="border rounded-3 p-3">
                        <Row className="g-2">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Award Title</Form.Label>

                              <Form.Control type="text" value={award.title} onChange={(e) => handleAwardChange(index, 'title', e.target.value)} />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Year</Form.Label>

                              <Form.Control
                                type="text"
                                placeholder="2025"
                                value={award.year}
                                onChange={(e) => handleAwardChange(index, 'year', e.target.value)}
                              />
                            </Form.Group>
                          </Col>

                          <Col xs={12}>
                            <Form.Group>
                              <Form.Label>Subtitle</Form.Label>

                              <Form.Control
                                type="text"
                                value={award.subtitle}
                                onChange={(e) => handleAwardChange(index, 'subtitle', e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        {awards.length > 1 && (
                          <button type="button" className="btn btn-soft-danger btn-sm mt-3" onClick={() => removeAward(index)}>
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                            Remove
                          </button>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>

            {/* ==================================================
                6. HOW TO USE
            ================================================== */}
            <Card className="border mb-4 shadow-none">
              <CardBody>
                <SectionHeader icon="solar:book-2-bold-duotone" title="How To Use" subtitle="Manage the steps shown to users." />

                <Row className="g-3">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Section Title</Form.Label>

                      <Form.Control type="text" value={howToTitle} onChange={(e) => setHowToTitle(e.target.value)} />
                    </Form.Group>
                  </Col>

                  <Col md={4} className="d-flex align-items-end">
                    <button type="button" className="btn btn-soft-primary" onClick={addStep}>
                      <IconifyIcon icon="solar:add-circle-broken" className="me-1" />
                      Add Step
                    </button>
                  </Col>

                  {steps.map((step, index) => (
                    <Col lg={6} key={index}>
                      <div className="border rounded-3 p-3 h-100">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="badge bg-primary">{index + 1}</span>

                          <strong>Step {index + 1}</strong>
                        </div>

                        <Form.Group className="mb-3">
                          <Form.Label>Step Title</Form.Label>

                          <Form.Control type="text" value={step.title} onChange={(e) => handleStepChange(index, 'title', e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Description</Form.Label>

                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={step.description}
                            onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                          />
                        </Form.Group>

                        {steps.length > 1 && (
                          <button type="button" className="btn btn-soft-danger btn-sm mt-3" onClick={() => removeStep(index)}>
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="me-1" />
                            Remove
                          </button>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>

            {/* ==================================================
                SAVE
            ================================================== */}
            <div className="d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-1" />
                    Saving...
                  </>
                ) : (
                  <>
                    <IconifyIcon icon="solar:diskette-bold-duotone" className="me-1 fs-18" />
                    Save About Us
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </CardBody>
    </Card>
  )
}

export default AboutUs
