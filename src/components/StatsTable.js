import React from 'react'
import { Table, Container } from 'react-bootstrap/'
import './StatsTable.css'

const StatsTable = (props) => {

  return (
    <Container className="StatsTable-topContainer">
      <h3>Repo stats:</h3>
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
                <th>{statData}</th>
              )}
            </tr>
          )}

        </tbody>
      </Table>
    </Container>
  )
}

export default StatsTable