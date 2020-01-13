import React from 'react'
import { Container } from 'react-bootstrap/'
import Chart from 'react-apexcharts'

class ChartContainer extends React.Component {

  state = {
    options: {
      chart: {
        id: 'apexchart-example'
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
      }
    },
    series: [{
      name: 'series-1',
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }]
  }

  render() {
    return (
      <Container className="mt-5 mb-5">
        <Chart options={this.state.options} series={this.state.series} type="line" />
      </Container>
    )
  }
}

export default ChartContainer