import React from 'react'
import { Button, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap/'

const GitHubAuthBtn = (props) => {

  const getAccessTokenShortForm = () => {
    let token = props.accessToken;
    if (token !== null && token !== undefined)
      return token.substring(0, 6);
    
    return ""
  }

  if (props.accessToken === null || props.accessToken === undefined || props.accessToken === "") {
    return (
      <Button variant="outline-light" onClick={props.onLoginClick}>GitHub Authentication</Button>
    )
  }
  else {
    return (
      <div>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250 }}
          overlay={<Tooltip>Access token stored in {props.storageType}</Tooltip>}
        >
          <Navbar.Text className="mr-2 ml-2">{`Signed in as: '${getAccessTokenShortForm()}'`}</Navbar.Text>
        </OverlayTrigger>
        <Button variant="outline-light" onClick={props.onLogoutClick}>Log Out</Button>
      </div>
    )
  }
}

export default GitHubAuthBtn