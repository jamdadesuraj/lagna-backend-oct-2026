import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'

import MotherTongueTable from './mothertonge'
export const metadata: Metadata = { title: 'Mother Tongue' }

const MotherTonguePage = () => {
  return (
    <>
      <PageTItle title="MOTHER TONGUE" />
      <Row>
        <Col xl={12}>
          <MotherTongueTable />
        </Col>
      </Row>
    </>
  )
}

export default MotherTonguePage
