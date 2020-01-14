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
        type: 'datetime'
      }
    },
    series: [
      {
        name: 'seladb/pcapplusplus',
        data: [
          { 
            x: new Date('2018-02-12').getTime(),
            y: 30
          },
          {
            x: new Date('2018-03-15').getTime(),
            y: 40
          },
          {
            x: new Date('2018-07-02').getTime(),
            y: 45
          },
          {
            x: new Date('2018-09-29').getTime(),
            y: 50
          },
          {
            x: new Date('2018-11-12').getTime(),
            y: 49
          },
          {
            x: new Date('2018-11-15').getTime(),
            y: 60
          },
          {
            x: new Date('2018-12-31').getTime(),
            y: 70
          },
          {
            x: new Date('2019-01-10').getTime(),
            y: 91
          }
        ]
      },
      {
        name: 'seladb/startrack-js',
        data: [
          { 
            x: new Date('2016-02-12').getTime(),
            y: 30
          },
          {
            x: new Date('2016-03-15').getTime(),
            y: 40
          },
          {
            x: new Date('2016-07-02').getTime(),
            y: 45
          },
          {
            x: new Date('2016-09-29').getTime(),
            y: 50
          },
          {
            x: new Date('2016-11-12').getTime(),
            y: 49
          },
          {
            x: new Date('2016-11-15').getTime(),
            y: 60
          },
          {
            x: new Date('2016-12-31').getTime(),
            y: 70
          },
          {
            x: new Date('2017-01-10').getTime(),
            y: 91
          }
        ]}
    ]
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