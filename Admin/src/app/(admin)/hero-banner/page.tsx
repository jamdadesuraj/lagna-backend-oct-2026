import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import HeroBannerTable from './banners'

export const metadata: Metadata = { title: 'Hero Banner' }

const HeroBannerPage = () => {
  return (
    <>
      <PageTItle title="HERO BANNER" />
      <Row>
        <Col xl={12}>
          <HeroBannerTable />
        </Col>
      </Row>
    </>
  )
}

export default HeroBannerPage
