'use client'

import { useState, useEffect } from 'react'
import { Form, Row, Col, Tabs, Tab, Button } from 'react-bootstrap'
import { ProfilePayload } from '../../../../store/profilesApi'
import { useGetReligionsQuery } from '../../../../store/religionApi'
import { useGetCastesByReligionQuery } from '../../../../store/casteApi'
import { useGetSubCastesByCasteQuery } from '../../../../store/subCasteApi'
import { useGetMotherTonguesQuery } from '../../../../store/motherToungeApi'
import { useGetHeightsQuery } from '../../../../store/heightApi'
import { useGetQualificationsQuery } from '../../../../store/qualificationApi'
import { useGetAnnualIncomesQuery } from '../../../../store/annualIncomeApi'
import { useGetOccupationsQuery } from '../../../../store/occupationApi'
import { Country, State, City } from 'country-state-city'

// Helper: comma-separated text <-> string[] for the list-type fields
export const toCsv = (arr: string[]) => arr.join(', ')
export const fromCsv = (value: string) =>
  value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)

// A sensible empty shape so every controlled input always has a defined value.
export const emptyProfile: ProfilePayload = {
  userId: '',
  basicDetails: { profileFor: '', gender: '', firstName: '', lastName: '', dob: '', age: 0, height: '', maritalStatus: '' },
  educationDetails: { highestQualification: '', educationType: '', occupation: '', annualIncome: '' },
  religionDetails: { religion: '', caste: '', subCaste: '', hasDosh: false, motherTongue: '' },
  locationDetails: { country: '', state: '', city: '' },
  horoscopeDetails: {
    birthTime: { hour: 0, minute: 0, meridiem: 'AM' },
    birthPlace: { country: '', state: '', city: '' },
    starDetails: { nakshatra: '', rashi: '' },
  },
  lifestyleDetails: { eatingHabit: '' },
  aboutMe: { about: '', describeYourself: '', profileCreatedBy: '', languagesISpeak: [], disability: '', thalassemia: '', hivStatus: false },
  photos: [],
  careerDetails: { employedIn: '', occupation: '', organizationName: '', interestedInSettlingAbroad: false },
  education: { aboutEducation: '', highestDegree: '', postGraduation: '', underGraduation: '', school: '' },
  family: {
    aboutFamily: '',
    fatherOccupation: '',
    motherOccupation: '',
    brothers: '',
    sisters: '',
    familyIncome: '',
    familyStatus: '',
    familyType: '',
    familyValue: '',
    livingWithParents: false,
    familyBasedOutOf: '',
  },
  contactDetails: { email: '', alternateEmail: '', phoneNumber: '', alternatePhoneNumber: '', landlineNumber: '', relationshipWithBrideOrGroom: '' },
  lifestyle: {
    dietaryHabit: '',
    drinkingHabit: '',
    smokingHabit: '',
    openToPets: false,
    ownHouse: false,
    ownCar: false,
    foodICook: '',
    hobbies: [],
    favouriteMusic: [],
    favouriteBooks: [],
    dressStyle: '',
    sports: [],
    cuisine: [],
    movies: [],
    favouriteRead: [],
    tvShow: [],
  },
}

interface ProfileFormFieldsProps {
  form: ProfilePayload
  setForm: React.Dispatch<React.SetStateAction<ProfilePayload>>
  photoFiles: File[]
  setPhotoFiles: React.Dispatch<React.SetStateAction<File[]>>
}
const NAKSHATRAS = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
]

const RASHIS = [
  'Mesha (Aries)',
  'Vrishabha (Taurus)',
  'Mithuna (Gemini)',
  'Karka (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrischika (Scorpio)',
  'Dhanu (Sagittarius)',
  'Makara (Capricorn)',
  'Kumbha (Aquarius)',
  'Meena (Pisces)',
]

const ProfileFormFields = ({ form, setForm, photoFiles, setPhotoFiles }: ProfileFormFieldsProps) => {
  // ---------- Master data ----------
  const { data: religionsRes } = useGetReligionsQuery()
  const { data: motherTonguesRes } = useGetMotherTonguesQuery()
  const { data: heightsRes } = useGetHeightsQuery()
  const { data: qualificationsRes } = useGetQualificationsQuery()
  const { data: annualIncomesRes } = useGetAnnualIncomesQuery()
  const { data: occupationsRes } = useGetOccupationsQuery()

  const religions = religionsRes?.data ?? []
  const motherTongues = motherTonguesRes?.data ?? []
  const heights = heightsRes?.data ?? []
  const qualifications = qualificationsRes?.data ?? []
  const annualIncomes = annualIncomesRes?.data ?? []
  const occupations = occupationsRes?.data ?? []

  // Caste depends on selected religion; Sub Caste depends on selected caste.
  // We track the selected master _id locally (the form itself only stores the
  // human-readable name string, matching the API's existing payload shape).
  const [selectedReligionId, setSelectedReligionId] = useState('')
  const [selectedCasteId, setSelectedCasteId] = useState('')

  const { data: castesRes } = useGetCastesByReligionQuery(selectedReligionId, { skip: !selectedReligionId })
  const { data: subCastesRes } = useGetSubCastesByCasteQuery(selectedCasteId, { skip: !selectedCasteId })
  const castes = castesRes?.data ?? []
  const subCastes = subCastesRes?.data ?? []

  // On edit, the form arrives pre-filled with names only (no ids). Resolve the
  // matching religion/caste id once the lists load, so the caste/sub-caste
  // dropdowns cascade correctly instead of showing empty.
  useEffect(() => {
    if (!selectedReligionId && form.religionDetails.religion && religions.length) {
      const match = religions.find((r) => r.religion === form.religionDetails.religion)
      if (match) setSelectedReligionId(match._id)
    }
  }, [religions, form.religionDetails.religion, selectedReligionId])

  useEffect(() => {
    if (!selectedCasteId && form.religionDetails.caste && castes.length) {
      const match = castes.find((c) => c.caste === form.religionDetails.caste)
      if (match) setSelectedCasteId(match._id)
    }
  }, [castes, form.religionDetails.caste, selectedCasteId])

  // Generic setter for a nested section field, e.g. update('basicDetails', 'firstName', value)
  const update = <S extends keyof ProfilePayload>(section: S, field: keyof ProfilePayload[S], value: unknown) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), [field]: value },
    }))
  }

  const handleReligionChange = (religionId: string) => {
    const match = religions.find((r) => r._id === religionId)
    setSelectedReligionId(religionId)
    setSelectedCasteId('') // reset dependent selections
    setForm((prev) => ({
      ...prev,
      religionDetails: { ...prev.religionDetails, religion: match?.religion ?? '', caste: '', subCaste: '' },
    }))
  }

  const handleCasteChange = (casteId: string) => {
    const match = castes.find((c) => c._id === casteId)
    setSelectedCasteId(casteId)
    setForm((prev) => ({
      ...prev,
      religionDetails: { ...prev.religionDetails, caste: match?.caste ?? '', subCaste: '' },
    }))
  }

  const handleQualificationChange = (qualificationId: string) => {
    const match = qualifications.find((q) => q._id === qualificationId)
    setForm((prev) => ({
      ...prev,
      educationDetails: {
        ...prev.educationDetails,
        highestQualification: match?.qualification ?? '',
        educationType: match?.educationType ?? prev.educationDetails.educationType,
      },
    }))
  }

  return (
    <Tabs defaultActiveKey="basic" className="mb-3">
      {/* ---------- Basic Details ---------- */}
      <Tab eventKey="basic" title="Basic">
        <Row className="g-3 mt-1">
          <Col md={4}>
            <Form.Label>First Name</Form.Label>
            <Form.Control value={form.basicDetails.firstName} onChange={(e) => update('basicDetails', 'firstName', e.target.value)} />
          </Col>
          <Col md={4}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control value={form.basicDetails.lastName} onChange={(e) => update('basicDetails', 'lastName', e.target.value)} />
          </Col>
          <Col md={4}>
            <Form.Label>Profile For</Form.Label>
            <Form.Select value={form.basicDetails.profileFor} onChange={(e) => update('basicDetails', 'profileFor', e.target.value)}>
              <option value="">Select</option>
              <option value="Myself">Myself</option>
              <option value="Son">My Son</option>
              <option value="Daughter">My Daughter</option>
              <option value="Brother">My Brother</option>
              <option value="Sister">My Sister</option>
              <option value="Relative">My Relative</option>
              <option value="Friend">My Friend</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Gender</Form.Label>
            <Form.Select value={form.basicDetails.gender} onChange={(e) => update('basicDetails', 'gender', e.target.value)}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={form.basicDetails.dob?.slice(0, 10) || ''}
              onChange={(e) => update('basicDetails', 'dob', e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Age</Form.Label>
            <Form.Control type="number" value={form.basicDetails.age} onChange={(e) => update('basicDetails', 'age', Number(e.target.value))} />
          </Col>
          <Col md={4}>
            <Form.Label>Height</Form.Label>
            <Form.Select value={form.basicDetails.height} onChange={(e) => update('basicDetails', 'height', e.target.value)}>
              <option value="">Select</option>
              {heights.map((h) => (
                <option key={h._id} value={h.height}>
                  {h.height}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Marital Status</Form.Label>
            <Form.Select value={form.basicDetails.maritalStatus} onChange={(e) => update('basicDetails', 'maritalStatus', e.target.value)}>
              <option value="">Select</option>
              <option value="Never Married">Never Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Awaiting Divorce">Awaiting Divorce</option>
            </Form.Select>
          </Col>
          <Col md={12}>
            <Form.Label>Photos</Form.Label>
            {form.photos.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-2">
                {form.photos.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt={`photo-${idx}`}
                      style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setForm((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }))}
                      style={{ position: 'absolute', top: -6, right: -6, borderRadius: '50%', padding: '0 6px' }}>
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotoFiles(Array.from((e.target as HTMLInputElement).files || []))}
            />
          </Col>
        </Row>
      </Tab>

      {/* ---------- Education / Career ---------- */}
      <Tab eventKey="education" title="Education & Career">
        <Row className="g-3 mt-1">
          <Col md={6}>
            <Form.Label>Highest Qualification</Form.Label>
            <Form.Select
              value={qualifications.find((q) => q.qualification === form.educationDetails.highestQualification)?._id ?? ''}
              onChange={(e) => handleQualificationChange(e.target.value)}>
              <option value="">Select</option>
              {qualifications.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.qualification}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Education Type</Form.Label>
            <Form.Select value={form.educationDetails.educationType} onChange={(e) => update('educationDetails', 'educationType', e.target.value)}>
              <option value="">Select</option>
              {Array.from(new Set(qualifications.map((q) => q.educationType).filter(Boolean))).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Occupation</Form.Label>
            <Form.Select value={form.educationDetails.occupation} onChange={(e) => update('educationDetails', 'occupation', e.target.value)}>
              <option value="">Select</option>
              {occupations.map((o) => (
                <option key={o._id} value={o.occupation}>
                  {o.occupation}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Annual Income</Form.Label>
            <Form.Select value={form.educationDetails.annualIncome} onChange={(e) => update('educationDetails', 'annualIncome', e.target.value)}>
              <option value="">Select</option>
              {annualIncomes.map((a) => (
                <option key={a._id} value={a.annualIncome}>
                  {a.annualIncome}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Employed In</Form.Label>
            <Form.Control value={form.careerDetails.employedIn} onChange={(e) => update('careerDetails', 'employedIn', e.target.value)} />
          </Col>
          <Col md={4}>
            <Form.Label>Occupation (Career)</Form.Label>
            <Form.Select value={form.careerDetails.occupation} onChange={(e) => update('careerDetails', 'occupation', e.target.value)}>
              <option value="">Select</option>
              {occupations.map((o) => (
                <option key={o._id} value={o.occupation}>
                  {o.occupation}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Organization Name</Form.Label>
            <Form.Control value={form.careerDetails.organizationName} onChange={(e) => update('careerDetails', 'organizationName', e.target.value)} />
          </Col>
          <Col md={4}>
            <Form.Label>Interested in Settling Abroad</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Yes"
                name="interestedInSettlingAbroad"
                checked={form.careerDetails.interestedInSettlingAbroad === true}
                onChange={() => update('careerDetails', 'interestedInSettlingAbroad', true)}
              />
              <Form.Check
                inline
                type="radio"
                label="No"
                name="interestedInSettlingAbroad"
                checked={form.careerDetails.interestedInSettlingAbroad === false}
                onChange={() => update('careerDetails', 'interestedInSettlingAbroad', false)}
              />
            </div>
          </Col>
          <Col md={4}>
            <Form.Label>Highest Degree</Form.Label>
            <Form.Select value={form.education.highestDegree} onChange={(e) => update('education', 'highestDegree', e.target.value)}>
              <option value="">Select</option>
              {qualifications.map((q) => (
                <option key={q._id} value={q.qualification}>
                  {q.qualification}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Post Graduation</Form.Label>
            <Form.Select value={form.education.postGraduation} onChange={(e) => update('education', 'postGraduation', e.target.value)}>
              <option value="">Select</option>
              {qualifications.map((q) => (
                <option key={q._id} value={q.qualification}>
                  {q.qualification}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Under Graduation</Form.Label>
            <Form.Select value={form.education.underGraduation} onChange={(e) => update('education', 'underGraduation', e.target.value)}>
              <option value="">Select</option>
              {qualifications.map((q) => (
                <option key={q._id} value={q.qualification}>
                  {q.qualification}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>School</Form.Label>
            <Form.Control value={form.education.school} onChange={(e) => update('education', 'school', e.target.value)} />
          </Col>
          <Col md={12}>
            <Form.Label>About Education</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={form.education.aboutEducation}
              onChange={(e) => update('education', 'aboutEducation', e.target.value)}
            />
          </Col>
        </Row>
      </Tab>

      {/* ---------- Religion / Location ---------- */}
      <Tab eventKey="religion" title="Religion & Location">
        <Row className="g-3 mt-1">
          <Col md={4}>
            <Form.Label>Religion</Form.Label>
            <Form.Select value={selectedReligionId} onChange={(e) => handleReligionChange(e.target.value)}>
              <option value="">Select</option>
              {religions.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.religion}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Caste</Form.Label>
            <Form.Select value={selectedCasteId} onChange={(e) => handleCasteChange(e.target.value)} disabled={!selectedReligionId}>
              <option value="">{selectedReligionId ? 'Select' : 'Select religion first'}</option>
              {castes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.caste}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Sub Caste</Form.Label>
            <Form.Select
              value={form.religionDetails.subCaste}
              onChange={(e) => update('religionDetails', 'subCaste', e.target.value)}
              disabled={!selectedCasteId}>
              <option value="">{selectedCasteId ? 'Select' : 'Select caste first'}</option>
              {subCastes.map((s) => (
                <option key={s._id} value={s.subCaste}>
                  {s.subCaste}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Mother Tongue</Form.Label>
            <Form.Select value={form.religionDetails.motherTongue} onChange={(e) => update('religionDetails', 'motherTongue', e.target.value)}>
              <option value="">Select</option>
              {motherTongues.map((m) => (
                <option key={m._id} value={m.motherTongue}>
                  {m.motherTongue}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Form.Group>
              <Form.Label>Has Dosh</Form.Label>

              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Yes"
                  name="hasDosh"
                  checked={form.religionDetails.hasDosh === true}
                  onChange={() => update('religionDetails', 'hasDosh', true)}
                />

                <Form.Check
                  inline
                  type="radio"
                  label="No"
                  name="hasDosh"
                  checked={form.religionDetails.hasDosh === false}
                  onChange={() => update('religionDetails', 'hasDosh', false)}
                />
              </div>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Label>Country</Form.Label>
            <Form.Select
              value={form.locationDetails.countryCode || ''}
              onChange={(e) => {
                const country = Country.getCountryByCode(e.target.value)
                update('locationDetails', 'country', country?.name || '')
                update('locationDetails', 'countryCode', e.target.value)
                update('locationDetails', 'state', '')
                update('locationDetails', 'city', '')
              }}>
              <option value="">Select Country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label>State</Form.Label>
            <Form.Select
              value={form.locationDetails.stateCode || ''}
              onChange={(e) => {
                const state = State.getStateByCodeAndCountry(e.target.value, form.locationDetails.countryCode || '')
                update('locationDetails', 'state', state?.name || '')
                update('locationDetails', 'stateCode', e.target.value)
                update('locationDetails', 'city', '')
              }}
              disabled={!form.locationDetails.countryCode}>
              <option value="">Select State</option>
              {State.getStatesOfCountry(form.locationDetails.countryCode).map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label>City</Form.Label>
            <Form.Select
              value={form.locationDetails.city}
              onChange={(e) => update('locationDetails', 'city', e.target.value)}
              disabled={!form.locationDetails.stateCode}>
              <option value="">Select City</option>
              {City.getCitiesOfState(form.locationDetails.countryCode || '', form.locationDetails.stateCode || '').map((ci) => (
                <option key={ci.name} value={ci.name}>
                  {ci.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Tab>

      {/* ---------- Horoscope ---------- */}
      <Tab eventKey="horoscope" title="Horoscope">
        <Row className="g-3 mt-1">
          <Col md={4}>
            <Form.Label>Birth Hour</Form.Label>
            <Form.Control
              type="number"
              value={form.horoscopeDetails.birthTime.hour}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  horoscopeDetails: { ...prev.horoscopeDetails, birthTime: { ...prev.horoscopeDetails.birthTime, hour: Number(e.target.value) } },
                }))
              }
            />
          </Col>
          <Col md={4}>
            <Form.Label>Birth Minute</Form.Label>
            <Form.Control
              type="number"
              value={form.horoscopeDetails.birthTime.minute}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  horoscopeDetails: { ...prev.horoscopeDetails, birthTime: { ...prev.horoscopeDetails.birthTime, minute: Number(e.target.value) } },
                }))
              }
            />
          </Col>
          <Col md={4}>
            <Form.Label>Meridiem</Form.Label>
            <Form.Select
              value={form.horoscopeDetails.birthTime.meridiem}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  horoscopeDetails: { ...prev.horoscopeDetails, birthTime: { ...prev.horoscopeDetails.birthTime, meridiem: e.target.value } },
                }))
              }>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </Form.Select>
          </Col>
          {/* <Col md={4} /> */}
          <Col md={4}>
            <Form.Label>Birth Place - Country</Form.Label>
            <Form.Select
              value={form.horoscopeDetails.birthPlace.countryCode || ''}
              onChange={(e) => {
                const country = Country.getCountryByCode(e.target.value)
                setForm((prev) => ({
                  ...prev,
                  horoscopeDetails: {
                    ...prev.horoscopeDetails,
                    birthPlace: {
                      ...prev.horoscopeDetails.birthPlace,
                      country: country?.name || '',
                      countryCode: e.target.value,
                      state: '',
                      stateCode: '',
                      city: '',
                    },
                  },
                }))
              }}>
              <option value="">Select Country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label>Birth Place - State</Form.Label>
            <Form.Select
              value={form.horoscopeDetails.birthPlace.stateCode || ''}
              onChange={(e) => {
                const state = State.getStateByCodeAndCountry(e.target.value, form.horoscopeDetails.birthPlace.countryCode || '')
                setForm((prev) => ({
                  ...prev,
                  horoscopeDetails: {
                    ...prev.horoscopeDetails,
                    birthPlace: { ...prev.horoscopeDetails.birthPlace, state: state?.name || '', stateCode: e.target.value, city: '' },
                  },
                }))
              }}
              disabled={!form.horoscopeDetails.birthPlace.countryCode}>
              <option value="">Select State</option>
              {State.getStatesOfCountry(form.horoscopeDetails.birthPlace.countryCode || '').map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label>Birth Place - City</Form.Label>
            <Form.Select
              value={form.horoscopeDetails.birthPlace.city}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  horoscopeDetails: {
                    ...prev.horoscopeDetails,
                    birthPlace: { ...prev.horoscopeDetails.birthPlace, city: e.target.value },
                  },
                }))
              }
              disabled={!form.horoscopeDetails.birthPlace.stateCode}>
              <option value="">Select City</option>
              {City.getCitiesOfState(form.horoscopeDetails.birthPlace.countryCode || '', form.horoscopeDetails.birthPlace.stateCode || '').map(
                (ci) => (
                  <option key={ci.name} value={ci.name}>
                    {ci.name}
                  </option>
                ),
              )}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Nakshatra</Form.Label>
            <Form.Select
              value={form.horoscopeDetails.starDetails.nakshatra}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  horoscopeDetails: { ...prev.horoscopeDetails, starDetails: { ...prev.horoscopeDetails.starDetails, nakshatra: e.target.value } },
                }))
              }>
              <option value="">Select Nakshatra</option>
              {NAKSHATRAS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Rashi</Form.Label>
            <Form.Select
              value={form.horoscopeDetails.starDetails.rashi}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  horoscopeDetails: { ...prev.horoscopeDetails, starDetails: { ...prev.horoscopeDetails.starDetails, rashi: e.target.value } },
                }))
              }>
              <option value="">Select Rashi</option>
              {RASHIS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Tab>

      {/* ---------- Family ---------- */}
      <Tab eventKey="family" title="Family">
        <Row className="g-3 mt-1">
          <Col md={4}>
            <Form.Label>Father's Occupation</Form.Label>
            <Form.Select value={form.family.fatherOccupation} onChange={(e) => update('family', 'fatherOccupation', e.target.value)}>
              <option value="">Select</option>
              {occupations.map((o) => (
                <option key={o._id} value={o.occupation}>
                  {o.occupation}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Mother's Occupation</Form.Label>
            <Form.Select value={form.family.motherOccupation} onChange={(e) => update('family', 'motherOccupation', e.target.value)}>
              <option value="">Select</option>
              {occupations.map((o) => (
                <option key={o._id} value={o.occupation}>
                  {o.occupation}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Family Income</Form.Label>
            <Form.Select value={form.family.familyIncome} onChange={(e) => update('family', 'familyIncome', e.target.value)}>
              <option value="">Select</option>
              {annualIncomes.map((a) => (
                <option key={a._id} value={a.annualIncome}>
                  {a.annualIncome}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Brothers</Form.Label>
            <Form.Select value={form.family.brothers} onChange={(e) => update('family', 'brothers', e.target.value)}>
              <option value="">Select</option>
              {['None', '1', '2', '3', '3+'].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Sisters</Form.Label>
            <Form.Select value={form.family.sisters} onChange={(e) => update('family', 'sisters', e.target.value)}>
              <option value="">Select</option>
              {['None', '1', '2', '3', '3+'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Family Status</Form.Label>
            <Form.Select value={form.family.familyStatus} onChange={(e) => update('family', 'familyStatus', e.target.value)}>
              <option value="">Select</option>
              {['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent', 'Elite'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Family Type</Form.Label>
            <Form.Select value={form.family.familyType} onChange={(e) => update('family', 'familyType', e.target.value)}>
              <option value="">Select</option>
              {['Joint Family', 'Nuclear Family', 'Extended Family', 'Single Parent Family'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Family Value</Form.Label>
            <Form.Control
              type="number"
              value={form.family.familyValue}
              onChange={(e) => update('family', 'familyValue', e.target.value.toString())}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Family Based Out Of</Form.Label>
            <Form.Control value={form.family.familyBasedOutOf} onChange={(e) => update('family', 'familyBasedOutOf', e.target.value)} />
          </Col>
          <Col md={4}>
            <Form.Label>Living with Parents</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Yes"
                name="livingWithParents"
                checked={form.family.livingWithParents === true}
                onChange={() => update('family', 'livingWithParents', true)}
              />
              <Form.Check
                inline
                type="radio"
                label="No"
                name="livingWithParents"
                checked={form.family.livingWithParents === false}
                onChange={() => update('family', 'livingWithParents', false)}
              />
            </div>
          </Col>
          <Col md={12}>
            <Form.Label>About Family</Form.Label>
            <Form.Control as="textarea" rows={2} value={form.family.aboutFamily} onChange={(e) => update('family', 'aboutFamily', e.target.value)} />
          </Col>
        </Row>
      </Tab>

      {/* ---------- Contact ---------- */}
      <Tab eventKey="contact" title="Contact">
        <Row className="g-3 mt-1">
          <Col md={6}>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={form.contactDetails.email} onChange={(e) => update('contactDetails', 'email', e.target.value)} />
          </Col>
          <Col md={6}>
            <Form.Label>Alternate Email</Form.Label>
            <Form.Control
              type="email"
              value={form.contactDetails.alternateEmail}
              onChange={(e) => update('contactDetails', 'alternateEmail', e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control value={form.contactDetails.phoneNumber} onChange={(e) => update('contactDetails', 'phoneNumber', e.target.value)} />
          </Col>
          <Col md={4}>
            <Form.Label>Alternate Phone Number</Form.Label>
            <Form.Control
              value={form.contactDetails.alternatePhoneNumber}
              onChange={(e) => update('contactDetails', 'alternatePhoneNumber', e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Landline Number</Form.Label>
            <Form.Control value={form.contactDetails.landlineNumber} onChange={(e) => update('contactDetails', 'landlineNumber', e.target.value)} />
          </Col>
          <Col md={6}>
            <Form.Label>Relationship with Bride/Groom</Form.Label>
            <Form.Control
              value={form.contactDetails.relationshipWithBrideOrGroom}
              onChange={(e) => update('contactDetails', 'relationshipWithBrideOrGroom', e.target.value)}
            />
          </Col>
        </Row>
      </Tab>

      {/* ---------- Lifestyle ---------- */}
      <Tab eventKey="lifestyle" title="Lifestyle">
        <Row className="g-3 mt-1">
          <Col md={4}>
            <Form.Label>Dietary Habit</Form.Label>
            <Form.Select value={form.lifestyle.dietaryHabit} onChange={(e) => update('lifestyle', 'dietaryHabit', e.target.value)}>
              <option value="">Select</option>
              {['Vegetarian', 'Non Vegetarian', 'Jain', 'Eggetarian', "Doesn't Matter"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Drinking Habit</Form.Label>
            <Form.Select value={form.lifestyle.drinkingHabit} onChange={(e) => update('lifestyle', 'drinkingHabit', e.target.value)}>
              <option value="">Select</option>
              {['Never', 'Occasionally', 'Regularly'].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Smoking Habit</Form.Label>
            <Form.Select value={form.lifestyle.smokingHabit} onChange={(e) => update('lifestyle', 'smokingHabit', e.target.value)}>
              <option value="">Select</option>
              {['Never', 'Occasionally', 'Regularly'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Open to Pets</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Yes"
                name="openToPets"
                checked={form.lifestyle.openToPets === true}
                onChange={() => update('lifestyle', 'openToPets', true)}
              />
              <Form.Check
                inline
                type="radio"
                label="No"
                name="openToPets"
                checked={form.lifestyle.openToPets === false}
                onChange={() => update('lifestyle', 'openToPets', false)}
              />
            </div>
          </Col>
          <Col md={4}>
            <Form.Label>Own House</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Yes"
                name="ownHouse"
                checked={form.lifestyle.ownHouse === true}
                onChange={() => update('lifestyle', 'ownHouse', true)}
              />
              <Form.Check
                inline
                type="radio"
                label="No"
                name="ownHouse"
                checked={form.lifestyle.ownHouse === false}
                onChange={() => update('lifestyle', 'ownHouse', false)}
              />
            </div>
          </Col>
          <Col md={4}>
            <Form.Label>Own Car</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Yes"
                name="ownCar"
                checked={form.lifestyle.ownCar === true}
                onChange={() => update('lifestyle', 'ownCar', true)}
              />
              <Form.Check
                inline
                type="radio"
                label="No"
                name="ownCar"
                checked={form.lifestyle.ownCar === false}
                onChange={() => update('lifestyle', 'ownCar', false)}
              />
            </div>
          </Col>
          <Col md={6}>
            <Form.Label>Hobbies (comma separated)</Form.Label>
            <Form.Control value={toCsv(form.lifestyle.hobbies)} onChange={(e) => update('lifestyle', 'hobbies', fromCsv(e.target.value))} />
          </Col>
          <Col md={6}>
            <Form.Label>Favourite Music (comma separated)</Form.Label>
            <Form.Control
              value={toCsv(form.lifestyle.favouriteMusic)}
              onChange={(e) => update('lifestyle', 'favouriteMusic', fromCsv(e.target.value))}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Favourite Books (comma separated)</Form.Label>
            <Form.Control
              value={toCsv(form.lifestyle.favouriteBooks)}
              onChange={(e) => update('lifestyle', 'favouriteBooks', fromCsv(e.target.value))}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Sports (comma separated)</Form.Label>
            <Form.Control value={toCsv(form.lifestyle.sports)} onChange={(e) => update('lifestyle', 'sports', fromCsv(e.target.value))} />
          </Col>
          <Col md={6}>
            <Form.Label>Cuisine (comma separated)</Form.Label>
            <Form.Control value={toCsv(form.lifestyle.cuisine)} onChange={(e) => update('lifestyle', 'cuisine', fromCsv(e.target.value))} />
          </Col>
          <Col md={6}>
            <Form.Label>Movies (comma separated)</Form.Label>
            <Form.Control value={toCsv(form.lifestyle.movies)} onChange={(e) => update('lifestyle', 'movies', fromCsv(e.target.value))} />
          </Col>
          <Col md={4}>
            <Form.Label>Dress Style</Form.Label>
            <Form.Control value={form.lifestyle.dressStyle} onChange={(e) => update('lifestyle', 'dressStyle', e.target.value)} />
          </Col>
          <Col md={8}>
            <Form.Label>Food I Cook</Form.Label>
            <Form.Control value={form.lifestyle.foodICook} onChange={(e) => update('lifestyle', 'foodICook', e.target.value)} />
          </Col>
        </Row>
      </Tab>

      {/* ---------- About Me ---------- */}
      <Tab eventKey="about" title="About Me">
        <Row className="g-3 mt-1">
          <Col md={12}>
            <Form.Label>About</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.aboutMe.about} onChange={(e) => update('aboutMe', 'about', e.target.value)} />
          </Col>
          <Col md={12}>
            <Form.Label>Describe Yourself</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={form.aboutMe.describeYourself}
              onChange={(e) => update('aboutMe', 'describeYourself', e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Profile Created By</Form.Label>
            <Form.Select value={form.aboutMe.profileCreatedBy} onChange={(e) => update('aboutMe', 'profileCreatedBy', e.target.value)}>
              <option value="">Select</option>
              {['Self', 'Parent', 'Sibling', 'Relative', 'Friend', 'Other'].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Disability</Form.Label>
            <Form.Select value={form.aboutMe.disability} onChange={(e) => update('aboutMe', 'disability', e.target.value)}>
              <option value="">Select</option>
              {[
                'None',
                'Physically disabled from birth',
                'Physically disabled due to accident',
                'Mentally disabled from birth',
                'Mentally disabled due to accident',
                "Doesn't Matter",
              ].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Thalassemia</Form.Label>
            <Form.Select value={form.aboutMe.thalassemia} onChange={(e) => update('aboutMe', 'thalassemia', e.target.value)}>
              <option value="">Select</option>
              {['No', 'Minor', 'Major', 'Trait', "Don't Know"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Languages I Speak (comma separated)</Form.Label>
            <Form.Control
              value={toCsv(form.aboutMe.languagesISpeak)}
              onChange={(e) => update('aboutMe', 'languagesISpeak', fromCsv(e.target.value))}
            />
          </Col>
          <Col md={6}>
            <Form.Label>HIV Status</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Positive"
                name="hivStatus"
                checked={form.aboutMe.hivStatus === true}
                onChange={() => update('aboutMe', 'hivStatus', true)}
              />
              <Form.Check
                inline
                type="radio"
                label="Negative"
                name="hivStatus"
                checked={form.aboutMe.hivStatus === false}
                onChange={() => update('aboutMe', 'hivStatus', false)}
              />
            </div>
          </Col>
        </Row>
      </Tab>
    </Tabs>
  )
}

export default ProfileFormFields
