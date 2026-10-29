import { Row } from 'react-bootstrap'
import Conversions from './components/Conversions'
import Stats from './components/Stats'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

const DashboardPage = () => {
  return (
    <>
      <Row>
        <Stats />
        <Conversions />
      </Row>
    </>
  )
}

export default DashboardPage
