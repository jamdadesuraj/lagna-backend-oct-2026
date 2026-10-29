'use client'

import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useGetSubscriptionStatsQuery } from '../../../../../../store/paymentsApi'
const TopCards = () => {
  const { data: statsRes, isLoading, isError } = useGetSubscriptionStatsQuery()

  const stats = statsRes?.data

  const formatNumber = (value?: number) => (isLoading || isError || value === undefined ? '—' : value.toLocaleString('en-IN'))

  const formatCurrency = (value?: number) => (isLoading || isError || value === undefined ? '—' : `₹${value.toLocaleString('en-IN')}`)

  const cards = [
    {
      title: 'Total Subscribed Members',
      value: formatNumber(stats?.totalSubscribed),
      icon: 'solar:users-group-rounded-bold-duotone',
      bg: '#EEF4FF',
      iconBg: '#DDE8FF',
      iconColor: '#4C6FFF',
    },
    {
      title: 'Today Subscribed Members',
      value: formatNumber(stats?.todaySubscribed),
      icon: 'solar:user-plus-bold-duotone',
      bg: '#ECFDF3',
      iconBg: '#D1FADF',
      iconColor: '#12B76A',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue),
      icon: 'solar:wallet-money-bold-duotone',
      bg: '#FFF8E6',
      iconBg: '#FEF0C7',
      iconColor: '#F79009',
    },
  ]

  return (
    <Row className="g-3 mb-3">
      {cards.map((item) => (
        <Col xs={12} md={6} xl={4} key={item.title}>
          <Card
            className="border-1 h-100"
            style={{
              background: item.bg,
              minHeight: '118px',
              borderRadius: '12px',
            }}>
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between gap-3 h-100">
                <div className="flex-grow-1">
                  <p
                    className="mb-2"
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#667085',
                    }}>
                    {item.title}
                  </p>

                  <h3
                    className="fw-bold mb-0"
                    style={{
                      fontSize: '26px',
                      lineHeight: 1.2,
                      letterSpacing: '-0.5px',
                      color: '#101828',
                    }}>
                    {item.value}
                  </h3>
                </div>

                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: '46px',
                    height: '46px',
                    background: item.iconBg,
                    color: item.iconColor,
                  }}>
                  <IconifyIcon icon={item.icon} className="fs-24" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default TopCards
