import React from 'react'
import { Container } from 'react-bootstrap/'
import ReactApexChart from 'react-apexcharts'

class ChartContainer extends React.Component {

  render() {
    const repos = this.props.repos;
    let chartSeries = repos.map( (repoData) => {
      return {
        name: repoData.username + "/" + repoData.repo,
        data: repoData.stargazerData
      }
    })

    let chartOptions = {
      chart: {
        id: 'stargazers'
      },
      xaxis: {
        type: 'datetime'
      },
      colors: repos.map( (repoData) => {
          return repoData.color
        })
    }

    return (
      <Container className="mt-5 mb-5">
        <ReactApexChart 
          options={chartOptions} 
          series={chartSeries} 
          type="line" 
        />
      </Container>
    )
  }
}

export default ChartContainer