'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React, { FormEvent, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Form, Row } from 'react-bootstrap'

const GetewaySettings = () => {
  // ==================================================
  // RAZORPAY
  // ==================================================
  const [razorpayEnabled, setRazorpayEnabled] = useState(true)

  const [razorpayMode, setRazorpayMode] = useState<'test' | 'live'>('test')

  const [razorpayKeyId, setRazorpayKeyId] = useState('')

  const [razorpayKeySecret, setRazorpayKeySecret] = useState('')

  const [razorpayWebhookSecret, setRazorpayWebhookSecret] = useState('')

  const [razorpayCurrency, setRazorpayCurrency] = useState('INR')

  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false)

  const [showRazorpayWebhook, setShowRazorpayWebhook] = useState(false)

  // ==================================================
  // CASHFREE
  // ==================================================
  const [cashfreeEnabled, setCashfreeEnabled] = useState(false)

  const [cashfreeMode, setCashfreeMode] = useState<'sandbox' | 'production'>('sandbox')

  const [cashfreeAppId, setCashfreeAppId] = useState('')

  const [cashfreeSecretKey, setCashfreeSecretKey] = useState('')

  const [cashfreeWebhookSecret, setCashfreeWebhookSecret] = useState('')

  const [cashfreeCurrency, setCashfreeCurrency] = useState('INR')

  const [showCashfreeSecret, setShowCashfreeSecret] = useState(false)

  const [showCashfreeWebhook, setShowCashfreeWebhook] = useState(false)

  // ==================================================
  // COMMON
  // ==================================================
  const [defaultGateway, setDefaultGateway] = useState<'razorpay' | 'cashfree'>('razorpay')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      defaultGateway,

      razorpay: {
        enabled: razorpayEnabled,
        mode: razorpayMode,
        keyId: razorpayKeyId,
        keySecret: razorpayKeySecret,
        webhookSecret: razorpayWebhookSecret,
        currency: razorpayCurrency,
      },

      cashfree: {
        enabled: cashfreeEnabled,
        mode: cashfreeMode,
        appId: cashfreeAppId,
        secretKey: cashfreeSecretKey,
        webhookSecret: cashfreeWebhookSecret,
        currency: cashfreeCurrency,
      },
    }

    console.log('Payment Gateway Settings:', payload)

    // API CALL HERE
  }

  return (
    <Card className="border-0 shadow-sm">
      {/* ================= HEADER ================= */}
      <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <CardTitle as="h4" className="mb-1">
            Payment Gateway Settings
          </CardTitle>

          <p className="text-muted fs-13 mb-0">Configure Razorpay and Cashfree payment gateways.</p>
        </div>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit}>
          {/* ==================================================
              DEFAULT PAYMENT GATEWAY
          ================================================== */}
          <Card className="border shadow-none mb-4">
            <CardBody>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: 38,
                    height: 38,
                  }}>
                  <IconifyIcon icon="solar:wallet-money-bold-duotone" className="fs-20" />
                </div>

                <div>
                  <h5 className="mb-1">General Payment Settings</h5>

                  <small className="text-muted">Select the primary payment gateway used during checkout.</small>
                </div>
              </div>

              <Row className="g-3">
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Default Payment Gateway</Form.Label>

                    <Form.Select value={defaultGateway} onChange={(e) => setDefaultGateway(e.target.value as 'razorpay' | 'cashfree')}>
                      <option value="razorpay">Razorpay</option>

                      <option value="cashfree">Cashfree</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              RAZORPAY
          ================================================== */}
          <Card className="border shadow-none mb-4">
            <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: 40,
                    height: 40,
                  }}>
                  <IconifyIcon icon="solar:card-2-bold-duotone" className="fs-20" />
                </div>

                <div>
                  <h5 className="mb-1">Razorpay</h5>

                  <small className="text-muted">Configure Razorpay payment credentials.</small>
                </div>
              </div>

              <Form.Check
                type="switch"
                id="razorpay-enabled"
                label={razorpayEnabled ? 'Enabled' : 'Disabled'}
                checked={razorpayEnabled}
                onChange={(e) => setRazorpayEnabled(e.target.checked)}
              />
            </CardHeader>

            <CardBody>
              <Row className="g-3">
                {/* MODE */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Environment</Form.Label>

                    <Form.Select
                      value={razorpayMode}
                      onChange={(e) => setRazorpayMode(e.target.value as 'test' | 'live')}
                      disabled={!razorpayEnabled}>
                      <option value="test">Test Mode</option>

                      <option value="live">Live Mode</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* CURRENCY */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Currency</Form.Label>

                    <Form.Select value={razorpayCurrency} onChange={(e) => setRazorpayCurrency(e.target.value)} disabled={!razorpayEnabled}>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* KEY ID */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Key ID</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="rzp_test_xxxxxxxxx"
                      value={razorpayKeyId}
                      onChange={(e) => setRazorpayKeyId(e.target.value)}
                      disabled={!razorpayEnabled}
                    />
                  </Form.Group>
                </Col>

                {/* SECRET */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Key Secret</Form.Label>

                    <div className="position-relative">
                      <Form.Control
                        type={showRazorpaySecret ? 'text' : 'password'}
                        className="pe-5"
                        placeholder="Enter Razorpay key secret"
                        value={razorpayKeySecret}
                        onChange={(e) => setRazorpayKeySecret(e.target.value)}
                        disabled={!razorpayEnabled}
                      />

                      <button
                        type="button"
                        className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0 text-muted"
                        onClick={() => setShowRazorpaySecret((prev) => !prev)}
                        disabled={!razorpayEnabled}>
                        <IconifyIcon icon={showRazorpaySecret ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="fs-18" />
                      </button>
                    </div>
                  </Form.Group>
                </Col>

                {/* WEBHOOK SECRET */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Webhook Secret</Form.Label>

                    <div className="position-relative">
                      <Form.Control
                        type={showRazorpayWebhook ? 'text' : 'password'}
                        className="pe-5"
                        placeholder="Enter webhook secret"
                        value={razorpayWebhookSecret}
                        onChange={(e) => setRazorpayWebhookSecret(e.target.value)}
                        disabled={!razorpayEnabled}
                      />

                      <button
                        type="button"
                        className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0 text-muted"
                        onClick={() => setShowRazorpayWebhook((prev) => !prev)}
                        disabled={!razorpayEnabled}>
                        <IconifyIcon icon={showRazorpayWebhook ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="fs-18" />
                      </button>
                    </div>
                  </Form.Group>
                </Col>

                {/* WEBHOOK URL */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Webhook URL</Form.Label>

                    <div className="input-group">
                      <Form.Control type="text" value="https://yourdomain.com/api/webhooks/razorpay" readOnly />

                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => navigator.clipboard.writeText('https://yourdomain.com/api/webhooks/razorpay')}>
                        <IconifyIcon icon="solar:copy-linear" className="fs-18" />
                      </button>
                    </div>

                    <small className="text-muted">Add this URL in your Razorpay webhook settings.</small>
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              CASHFREE
          ================================================== */}
          <Card className="border shadow-none mb-4">
            <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                  style={{
                    width: 40,
                    height: 40,
                  }}>
                  <IconifyIcon icon="solar:wallet-bold-duotone" className="fs-20" />
                </div>

                <div>
                  <h5 className="mb-1">Cashfree</h5>

                  <small className="text-muted">Configure Cashfree payment credentials.</small>
                </div>
              </div>

              <Form.Check
                type="switch"
                id="cashfree-enabled"
                label={cashfreeEnabled ? 'Enabled' : 'Disabled'}
                checked={cashfreeEnabled}
                onChange={(e) => setCashfreeEnabled(e.target.checked)}
              />
            </CardHeader>

            <CardBody>
              <Row className="g-3">
                {/* MODE */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Environment</Form.Label>

                    <Form.Select
                      value={cashfreeMode}
                      onChange={(e) => setCashfreeMode(e.target.value as 'sandbox' | 'production')}
                      disabled={!cashfreeEnabled}>
                      <option value="sandbox">Sandbox</option>

                      <option value="production">Production</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* CURRENCY */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Currency</Form.Label>

                    <Form.Select value={cashfreeCurrency} onChange={(e) => setCashfreeCurrency(e.target.value)} disabled={!cashfreeEnabled}>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* APP ID */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>App ID / Client ID</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Enter Cashfree App ID"
                      value={cashfreeAppId}
                      onChange={(e) => setCashfreeAppId(e.target.value)}
                      disabled={!cashfreeEnabled}
                    />
                  </Form.Group>
                </Col>

                {/* SECRET KEY */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Secret Key</Form.Label>

                    <div className="position-relative">
                      <Form.Control
                        type={showCashfreeSecret ? 'text' : 'password'}
                        className="pe-5"
                        placeholder="Enter Cashfree secret key"
                        value={cashfreeSecretKey}
                        onChange={(e) => setCashfreeSecretKey(e.target.value)}
                        disabled={!cashfreeEnabled}
                      />

                      <button
                        type="button"
                        className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0 text-muted"
                        onClick={() => setShowCashfreeSecret((prev) => !prev)}
                        disabled={!cashfreeEnabled}>
                        <IconifyIcon icon={showCashfreeSecret ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="fs-18" />
                      </button>
                    </div>
                  </Form.Group>
                </Col>

                {/* WEBHOOK SECRET */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Webhook Secret</Form.Label>

                    <div className="position-relative">
                      <Form.Control
                        type={showCashfreeWebhook ? 'text' : 'password'}
                        className="pe-5"
                        placeholder="Enter Cashfree webhook secret"
                        value={cashfreeWebhookSecret}
                        onChange={(e) => setCashfreeWebhookSecret(e.target.value)}
                        disabled={!cashfreeEnabled}
                      />

                      <button
                        type="button"
                        className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0 text-muted"
                        onClick={() => setShowCashfreeWebhook((prev) => !prev)}
                        disabled={!cashfreeEnabled}>
                        <IconifyIcon icon={showCashfreeWebhook ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="fs-18" />
                      </button>
                    </div>
                  </Form.Group>
                </Col>

                {/* WEBHOOK URL */}
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Webhook URL</Form.Label>

                    <div className="input-group">
                      <Form.Control value="https://yourdomain.com/api/webhooks/cashfree" readOnly />

                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => navigator.clipboard.writeText('https://yourdomain.com/api/webhooks/cashfree')}>
                        <IconifyIcon icon="solar:copy-linear" className="fs-18" />
                      </button>
                    </div>

                    <small className="text-muted">Add this URL in Cashfree webhook configuration.</small>
                  </Form.Group>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* ==================================================
              SAVE
          ================================================== */}
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              <IconifyIcon icon="solar:diskette-bold-duotone" className="me-1 fs-18" />
              Save Gateway Settings
            </button>
          </div>
        </Form>
      </CardBody>
    </Card>
  )
}

export default GetewaySettings
