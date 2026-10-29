import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AppSettings from './AppSettings'

export const metadata: Metadata = { title: 'App Settings' }

const AppSettingsPage = () => {
  return (
    <>
      <PageTItle title="App Settings" />
      <Row>
        <Col xl={12}>
          <AppSettings />
        </Col>
      </Row>
    </>
  )
}

export default AppSettingsPage
