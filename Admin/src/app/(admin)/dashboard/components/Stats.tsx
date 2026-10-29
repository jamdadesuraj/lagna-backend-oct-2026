'use client'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { ApexOptions } from 'apexcharts'
import Link from 'next/link'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import { buildStateData } from '../data'
import { StatType } from '../types'
import { useGetDashboardStatsQuery } from '../../../../../store/dashboardApi'

const StatsCard = ({ amount, change, icon, name, bg }: StatType) => {
  return (
    <Col md={4}>
      <Card className={`overflow-hidden border-1 `} style={{ backgroundColor: bg }}>
        <CardBody>
          <Row className="align-items-center">
            <Col xs={5}>
              <div className={`avatar-md bg-white bg-opacity-75 rounded flex-centered`}>
                <IconifyIcon icon={icon} className={`fs-24 `} />
              </div>
            </Col>

            <Col xs={7} className="text-end">
              <p className="text-dark mb-1 text-truncate">{name}</p>

              <h4 className="text-dark mt-1 mb-0">{amount}</h4>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

const Stats = () => {
  // Refetch every time the dashboard is opened so the numbers are never stale
  const { data, isError } = useGetDashboardStatsQuery(undefined, { refetchOnMountOrArgChange: true })

  // '...' while loading, '—' if the request failed
  const cards = buildStateData(data?.data, isError ? '—' : '...')

  const chartOptions: ApexOptions = {
    chart: {
      height: 292,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '14px',
            color: 'undefined',
            offsetY: 100,
          },
          value: {
            offsetY: 55,
            fontSize: '20px',
            color: undefined,
            formatter: function (val) {
              return val + '%'
            },
          },
        },
        track: {
          background: 'rgba(170,184,197, 0.2)',
          margin: 0,
        },
      },
    },
    fill: {
      gradient: {
        // enabled: true,
        shade: 'dark',
        shadeIntensity: 0.2,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    colors: ['#ff6c2f', '#22c55e'],
    series: [65.2],
    labels: ['Returning Customer'],
    responsive: [
      {
        breakpoint: 380,
        options: {
          chart: {
            height: 180,
          },
        },
      },
    ],
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  }

  return (
    <>
      <Col xxl={8}>
        <Row>
          <Col xs={12}>
            <div className="alert alert-primary text-truncate mb-3" role="alert">
              👋 Welcome to the Dashboard
            </div>
          </Col>
          {cards.map((item, idx) => (
            <StatsCard key={idx} {...item} />
          ))}
        </Row>
      </Col>

      <Col lg={4}>
        <Card>
          <CardBody>
            <CardTitle as={'h5'}>Users Graph</CardTitle>
            <ReactApexChart options={chartOptions} series={chartOptions.series} height={292} type="radialBar" className="apex-charts mb-2 mt-n2" />
            <Row className="text-center">
              <Col xs={6}>
                <p className="text-muted mb-2">Todays Users</p>
                <h3 className="text-dark mb-3">23.5k</h3>
              </Col>
              <Col xs={6}>
                <p className="text-muted mb-2">Last Week</p>
                <h3 className="text-dark mb-3">41.05k</h3>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default Stats
