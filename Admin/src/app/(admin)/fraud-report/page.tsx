import React from 'react'
import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import FraudReport from './FraudReport'

export const metadata: Metadata = { title: 'Fraud Report' }

const FraudReportPage = () => {
  return (
    <>
      <PageTItle title="Fraud Report" />
      <Row>
        <Col xs={12}>
          <FraudReport />
        </Col>
      </Row>
    </>
  )
}

export default FraudReportPage
