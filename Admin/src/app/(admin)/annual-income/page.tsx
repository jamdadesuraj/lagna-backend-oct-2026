import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AnnualIncomeTable from './table'

export const metadata: Metadata = { title: 'Annual Income' }

const AnnualIncomePage = () => {
  return (
    <>
      <PageTItle title="ANNUAL INCOME" />
      <Row>
        <Col xl={12}>
          <AnnualIncomeTable />
        </Col>
      </Row>
    </>
  )
}

export default AnnualIncomePage
