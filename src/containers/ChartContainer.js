import React from 'react'
import { Container } from 'react-bootstrap/'
import ReactApexChart from 'react-apexcharts'

class ChartContainer extends React.Component {

  static chartOptions = {
    chart: {
      id: 'stargazers'
    },
    xaxis: {
      type: 'datetime'
    }
  }

  render() {
    const repos = this.props.repos;
    let chartSeries = repos.map( (repoData, index) => {
      return {
        name: repoData.username + "/" + repoData.repo,
        data: repoData.stargazerData
      }
    })

    return (
      <Container className="mt-5 mb-5">
        <ReactApexChart 
          options={ChartContainer.chartOptions} 
          series={chartSeries} 
          type="line" 
        />
      </Container>
    )
  }
}

export default ChartContainer