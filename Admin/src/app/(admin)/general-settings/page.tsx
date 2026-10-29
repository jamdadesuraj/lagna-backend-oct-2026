import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import GeneralSettings from './GeneralSettings'

export const metadata: Metadata = { title: 'General Settings' }

const GeneralSettingsPage = () => {
  return (
    <>
      <PageTItle title="General Settings" />
      <Row>
        <Col xl={12}>
          <GeneralSettings />
        </Col>
      </Row>
    </>
  )
}

export default GeneralSettingsPage
