import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import WebSettings from './WebSettings'

export const metadata: Metadata = { title: 'Web Settings' }

const WebSettingsPage = () => {
  return (
    <>
      <PageTItle title="Web Settings" />
      <Row>
        <Col xl={12}>
          <WebSettings />
        </Col>
      </Row>
    </>
  )
}

export default WebSettingsPage
