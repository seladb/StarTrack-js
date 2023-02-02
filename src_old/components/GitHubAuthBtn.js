import React from "react";
import { Button, Navbar, OverlayTrigger, Tooltip } from "react-bootstrap/";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

export default function GitHubAuthBtn({
  accessToken,
  storageType,
  onLoginClick,
  onLogoutClick,
}) {
  const getAccessTokenShortForm = () => {
    const token = accessToken;
    if (token !== null && token !== undefined) return token.substring(0, 6);

    return "";
  };

  const smallScreen = useMediaQuery({ query: "(max-width: 650px)" });

  if (accessToken === null || accessToken === undefined || accessToken === "") {
    return (
      <Button variant="outline-light" onClick={onLoginClick}>
        {smallScreen ? (
          <FontAwesomeIcon icon={faSignInAlt} className="mr-1" />
        ) : (
          "GitHub Authentication"
        )}
      </Button>
    );
  } else {
    return (
      <div>
        {smallScreen ? (
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
              <Tooltip>
                Access token &apos;{getAccessTokenShortForm()}&apos; stored in{" "}
                {storageType}
              </Tooltip>
            }
          >
            <Button>
              <FontAwesomeIcon icon={faKey} className="mr-1" />
            </Button>
          </OverlayTrigger>
        ) : (
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250 }}
            overlay={<Tooltip>Access token stored in {storageType}</Tooltip>}
          >
            <Navbar.Text className="mr-2 ml-2">
              <FontAwesomeIcon icon={faKey} className="mr-1" />
              {getAccessTokenShortForm()}
            </Navbar.Text>
          </OverlayTrigger>
        )}
        <Button variant="outline-light" onClick={onLogoutClick}>
          {smallScreen ? (
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
          ) : (
            "Log Out"
          )}
        </Button>
      </div>
    );
  }
}
