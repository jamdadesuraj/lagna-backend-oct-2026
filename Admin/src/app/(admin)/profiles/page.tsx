import { Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ProfileTable from './profiles'

export const metadata: Metadata = { title: 'Profile Management' }

const ProfilePage = () => {
  return (
    <>
      <PageTItle title="PROFILE MANAGEMENT" />
      <Row>
        <Col xl={12}>
          <ProfileTable />
        </Col>
      </Row>
    </>
  )
}

export default ProfilePage
