import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import FaqTable from './faqs'

export const metadata: Metadata = { title: 'FAQs' }

const FaqPage = () => {
  return (
    <>
      <PageTItle title="FAQs" />
      <Row>
        <Col xl={12}>
          <FaqTable />
        </Col>
      </Row>
    </>
  )
}

export default FaqPage
