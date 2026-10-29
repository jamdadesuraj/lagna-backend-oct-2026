import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import HelpCenterTable from './helpCentre'

export const metadata: Metadata = { title: 'Help Center' }

const HelpCenterPage = () => {
  return (
    <>
      <PageTItle title="HELP CENTER" />
      <Row>
        <Col xl={12}>
          <HelpCenterTable />
        </Col>
      </Row>
    </>
  )
}

export default HelpCenterPage
