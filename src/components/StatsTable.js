import React from 'react'
import { Table, Container, Form } from 'react-bootstrap/'
import './StatsTable.css'

const StatsTable = (props) => {

  const onSyncCheckBoxChanged = (event) => {
    if (props.requestToSyncChartTimeRange) {
      props.requestToSyncChartTimeRange(event.target.checked);
    }
  }

  return (
    <Container className="StatsTable-topContainer">
      <h3>Repo stats:</h3>
      <Form className="mb-3">
        <Form.Check type="checkbox" label="Sync stats to chart zoom level" onChange={onSyncCheckBoxChanged}/>
      </Form>
      <Table bordered responsive hover>
        <thead>
          <tr className="StatsTable-header">
            <th/>
            { Object.keys(props.repos[0].stats).map( statName => 
              <th>{statName}</th> 
            )}
          </tr>
        </thead>
        <tbody>
          { props.repos.map( repoData => 
            <tr className="StatsTable-row" style={{backgroundColor: repoData.color}}>
              <th>{repoData.username + " / " + repoData.repo}</th>
              { Object.values(repoData.stats).map( statData => 
                <td>{statData}</td>
              )}
            </tr>
          )}

        </tbody>
      </Table>
    </Container>
  )
}

export default StatsTable