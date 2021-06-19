import React from "react";
import PropTypes from "prop-types";
import { Table, Container, Form } from "react-bootstrap/";
import "./StatsTable.css";

export default function StatsTable({ repos, requestToSyncChartTimeRange }) {
  const onSyncCheckBoxChanged = (event) => {
    if (requestToSyncChartTimeRange) {
      requestToSyncChartTimeRange(event.target.checked);
    }
  };

  const repoNameFromData = (repoData) => {
    return repoData.username + " / " + repoData.repo;
  };

  return (
    <Container className="StatsTable-topContainer">
      <h3>Repo stats</h3>
      <Form className="mb-3">
        <Form.Check
          type="checkbox"
          label="Sync stats to chart zoom level"
          onChange={onSyncCheckBoxChanged}
        />
      </Form>
      <Table bordered responsive hover>
        <thead>
          <tr className="StatsTable-header">
            <th />
            {Object.keys(repos[0].stats).map((statName) => (
              <th key={statName}>{statName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {repos.map((repoData) => (
            <tr
              className="StatsTable-row"
              style={{ backgroundColor: repoData.color }}
              key={repoNameFromData(repoData)}
            >
              <th>{repoNameFromData(repoData)}</th>
              {Object.keys(repoData.stats).map((statName) => (
                <td key={statName}>{repoData.stats[statName]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
StatsTable.propTypes = {
  repos: PropTypes.array,
  requestToSyncChartTimeRange: PropTypes.func,
};
