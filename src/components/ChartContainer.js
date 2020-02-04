import React from 'react'
import { Container } from 'react-bootstrap/'
import ReactApexChart from 'react-apexcharts'

const ChartContainer = (props) => {

  const chartSeries = props.repos.map( (repoData) => {
    return {
      name: repoData.username + "/" + repoData.repo,
      data: repoData.stargazerData
    }
  })

  const chartOptions = {
    chart: {
      id: "stargazers",
      zoom: {
        autoScaleYaxis: (props.repos.length > 1 ? false : true), 
      },
    },
    xaxis: {
      type: "datetime"
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    colors: props.repos.map( (repoData) => {
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

export default ChartContainer