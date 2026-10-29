import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import GetewaySettings from './GetewaySettings'

export const metadata: Metadata = { title: 'Gateway Settings' }

const GetewaySettingsPage = () => {
  return (
    <>
      <PageTItle title="Gateway Settings" />
      <Row>
        <Col xl={12}>
          <GetewaySettings />
        </Col>
      </Row>
    </>
  )
}

export default GetewaySettingsPage
