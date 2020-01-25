import React from 'react'
import { Button, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap/'

class GitHubAuthBtn extends React.Component {

  getAccessTokenShortForm() {
    let token = this.props.accessToken;
    if (token !== null && token !== undefined)
      return token.substring(0, 6);
    
    return ""
  }

  render() {
    if (this.props.accessToken === null || this.props.accessToken === undefined || this.props.accessToken === "") {
      return (
        <Button onClick={this.props.onLoginClick}>GitHub Authentication</Button>
      )
    }
    else {
      return (
        <div>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250 }}
            overlay={<Tooltip>Access token stored in {this.props.storageType}</Tooltip>}
          >
            <Navbar.Text>{`Signed in as: '${this.getAccessTokenShortForm()}'`}</Navbar.Text>
          </OverlayTrigger>
          <Button onClick={this.props.onLogoutClick}>Log Out</Button>
        </div>
      )
    }
  }
}

export default GitHubAuthBtn