import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import PackageTable from './packages'

export const metadata: Metadata = { title: 'Packages' }

const PackagesPage = () => {
  return (
    <>
      <PageTItle title="PACKAGES" />
      <Row>
        <Col xl={12}>
          <PackageTable />
        </Col>
      </Row>
    </>
  )
}

export default PackagesPage
