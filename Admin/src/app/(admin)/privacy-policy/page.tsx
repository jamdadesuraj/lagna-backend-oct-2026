import React from 'react'
import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import PrivacyPolicyEditor from './editPolicy'

export const metadata: Metadata = { title: 'Privacy Policy' }

const PrivacyPolicyPage = () => {
  return (
    <>
      <PageTItle title="PRIVACY POLICY" />
      <Row>
        <Col xs={12}>
          <PrivacyPolicyEditor />
        </Col>
      </Row>
    </>
  )
}

export default PrivacyPolicyPage
