import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import HeightTable from './height'

export const metadata: Metadata = { title: 'Height' }

const HeightPage = () => {
  return (
    <>
      <PageTItle title="HEIGHT" />
      <Row>
        <Col xl={12}>
          <HeightTable />
        </Col>
      </Row>
    </>
  )
}

export default HeightPage
