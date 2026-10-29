import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import QualificationTable from './qualification'

export const metadata: Metadata = { title: 'Qualification' }

const QualificationPage = () => {
  return (
    <>
      <PageTItle title="QUALIFICATION" />
      <Row>
        <Col xl={12}>
          <QualificationTable />
        </Col>
      </Row>
    </>
  )
}

export default QualificationPage
