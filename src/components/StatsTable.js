import React from 'react'
import { Table } from 'react-bootstrap/'

class StatsTable extends React.Component {

  render() {
    return (
      <Table bordered responsive hover>
        <thead>
          <tr style={{backgroundColor: '#e9ecef'}}>
            <th/>
            { Object.keys(this.props.repos[0].stats).map( statName => 
              <th>{statName}</th> 
            )}
          </tr>
        </thead>
        <tbody>
          { this.props.repos.map( repoData => 
            <tr style={{color: '#fff', backgroundColor: repoData.color}}>
              <th>{repoData.username + " / " + repoData.repo}</th>
              { Object.values(repoData.stats).map( statData => 
                <th>{statData}</th>
              )}
            </tr>
          )}

        </tbody>
      </Table>
    )
  }
}

export default StatsTable