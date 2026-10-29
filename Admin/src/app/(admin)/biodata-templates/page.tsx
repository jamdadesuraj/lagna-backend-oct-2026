import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import BiodataTemplates from './Biodatatemplates'

export const metadata: Metadata = { title: 'Biodata Templates' }

const BiodataTemplatesPage = () => {
  return (
    <>
      <PageTItle title="BIODATA TEMPLATES" />
      <Row>
        <Col xl={12}>
          <BiodataTemplates />
        </Col>
      </Row>
    </>
  )
}

export default BiodataTemplatesPage
