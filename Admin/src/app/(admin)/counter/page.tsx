import React from 'react'
import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import CounterEditor from './editCounter'
export const metadata: Metadata = { title: 'Counter' }

const CounterPage = () => {
  return (
    <>
      <PageTItle title="COUNTER" />
      <Row>
        <Col xs={12}>
          <CounterEditor />
        </Col>
      </Row>
    </>
  )
}

export default CounterPage
