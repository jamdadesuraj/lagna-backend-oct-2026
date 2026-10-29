'use client'
import { WorldVectorMap } from '@/components/VectorMap'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { pagesList } from '../data'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'

const Conversions = () => {
  const chartOptions: ApexOptions = {
    series: [
      {
        name: 'Page Views',
        type: 'bar',
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
      },
      {
        name: 'Clicks',
        type: 'area',
        data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
      },
    ],
    chart: {
      height: 313,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 0],
      width: [0, 2],
      curve: 'smooth',
    },
    fill: {
      opacity: [1, 1],
      type: ['solid', 'gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90],
      },
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        barHeight: '70%',
        borderRadius: 3,
      },
    },
    colors: ['#ff6c2f', '#22c55e'],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1) + 'k'
            }
            return y
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1) + 'k'
            }
            return y
          },
        },
      ],
    },
  }
  const options = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: false,
    markersSelectable: true,
    markers: [
      { name: 'Canada', coords: [56.1304, -106.3468] },
      { name: 'Brazil', coords: [-14.235, -51.9253] },
      { name: 'Russia', coords: [61, 105] },
      { name: 'China', coords: [35.8617, 104.1954] },
      { name: 'United States', coords: [37.0902, -95.7129] },
    ],
    markerStyle: {
      initial: { fill: '#7f56da' },
      selected: { fill: '#22c55e' },
    },
    labels: {
      markers: {
        render: (marker: any) => marker.name,
      },
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1,
      },
    },
  }
  return (
    <>
      <Col xxl={6}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <CardTitle as={'h4'}>Monthly Revenu Report</CardTitle>
            </div>
            <div dir="ltr">
              <div id="dash-performance-chart" className="apex-charts" />
              <ReactApexChart options={chartOptions} series={chartOptions.series} height={313} type="line" className="apex-charts" />
            </div>
          </CardBody>
        </Card>
      </Col>

      <Col lg={6}>
        <Card className="card-height-100">
          <CardHeader className="d-flex align-items-center justify-content-between gap-2">
            <CardTitle as={'h4'} className="flex-grow-1">
              Verified Profiles
            </CardTitle>
            <Link href="/profile-verification" className="btn btn-sm btn-primary">
              View All
            </Link>
          </CardHeader>
          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-nowrap table-centered m-0 table-bordered">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th className="text-muted ps-3">User Name</th>
                    <th className="text-muted">User ID</th>
                    <th className="text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="ps-3">
                      <Link href="" className="text-muted">
                        Suraj Jamdade
                      </Link>
                    </td>
                    <td>SJ01012000</td>
                    <td>
                      <span className={`badge badge-soft-warning text-dark`}>Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default Conversions
