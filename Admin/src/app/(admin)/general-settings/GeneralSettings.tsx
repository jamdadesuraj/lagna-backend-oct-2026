'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React, { FormEvent, useEffect, useState } from 'react'
import { Card, CardBody } from 'react-bootstrap'
import { useGetCurrentAdminQuery, useUpdateAdminCredentialsMutation } from '../../../../store/generalSettingsApi'

const GeneralSettings = () => {
  const { data } = useGetCurrentAdminQuery()
  const [updateAdminCredentials, { isLoading: isSaving }] = useUpdateAdminCredentialsMutation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')

  // Prefill username (email) from current admin
  useEffect(() => {
    if (data?.data?.email) {
      setUsername(data.data.email)
    }
  }, [data])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.')
      return
    }

    try {
      await updateAdminCredentials({ username, password, confirmPassword }).unwrap()

      setPassword('')
      setConfirmPassword('')
      // e.g. toast.success('Credentials updated successfully')
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to update credentials.')
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardBody>
        <h4 className="mb-1">General Settings</h4>
        <p className="text-muted fs-13 mb-4">Manage admin login username and password.</p>

        <Card className="border shadow-none">
          <CardBody>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}>
                <IconifyIcon icon="solar:user-id-bold-duotone" className="fs-18" />
              </div>

              <div>
                <h5 className="mb-1">Login Credentials</h5>
                <small className="text-muted">Update your username and account password.</small>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger py-2">{error}</div>}

              {/* USERNAME */}
              <div className="mb-3">
                <label className="form-label">
                  Username <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <IconifyIcon icon="solar:user-bold-duotone" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row g-3">
                {/* PASSWORD */}
                <div className="col-lg-6">
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <IconifyIcon icon="solar:lock-password-bold-duotone" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button type="button" className="input-group-text" onClick={() => setShowPassword((prev) => !prev)}>
                      <IconifyIcon icon={showPassword ? 'solar:eye-closed-bold-duotone' : 'solar:eye-bold-duotone'} />
                    </button>
                  </div>
                  <small className="text-muted">Minimum 6 characters.</small>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="col-lg-6">
                  <label className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <IconifyIcon icon="solar:lock-password-bold-duotone" />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button type="button" className="input-group-text" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                      <IconifyIcon icon={showConfirmPassword ? 'solar:eye-closed-bold-duotone' : 'solar:eye-bold-duotone'} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-warning text-white" disabled={isSaving}>
                  <IconifyIcon icon="solar:diskette-bold-duotone" className="me-1 fs-18" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  )
}

export default GeneralSettings
