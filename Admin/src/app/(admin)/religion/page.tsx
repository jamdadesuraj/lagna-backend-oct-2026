import { Col, Row } from 'react-bootstrap'
import ProductList from './components/tables'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ReligionCasteSubCaste from './components/religion'
export const metadata: Metadata = { title: 'Product List' }

const ProductListPage = () => {
  return (
    <>
      <PageTItle title="PRODUCT LIST" />
      <Row>
        <Col xl={12}>
          <ReligionCasteSubCaste />
        </Col>
      </Row>
    </>
  )
}

export default ProductListPage
