import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import OccupationTable from './occupation'

export const metadata: Metadata = { title: 'Occupation' }

const OccupationPage = () => {
  return (
    <>
      <PageTItle title="OCCUPATION" />
      <Row>
        <Col xl={12}>
          <OccupationTable />
        </Col>
      </Row>
    </>
  )
}

export default OccupationPage
