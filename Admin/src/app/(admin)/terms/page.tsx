import React from 'react'
import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import TermsConditionsEditor from './terms'

export const metadata: Metadata = { title: 'Terms & Conditions' }

const FraudReportPage = () => {
  return (
    <>
      <PageTItle title="TERMS & CONDITIONS" />
      <Row>
        <Col xs={12}>
          <TermsConditionsEditor />
        </Col>
      </Row>
    </>
  )
}

export default FraudReportPage
