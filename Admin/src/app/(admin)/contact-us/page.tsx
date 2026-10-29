import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ContactUsEditor from './editor'

export const metadata: Metadata = { title: 'Contact Us' }

const ContactUsPage = () => {
  return (
    <>
      <PageTItle title="CONTACT US" />
      <Row>
        <Col xs={12}>
          <ContactUsEditor />
        </Col>
      </Row>
    </>
  )
}

export default ContactUsPage
