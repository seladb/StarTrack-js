import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Badge, Button } from "react-bootstrap/";
import "./ClosableBadge.css";

export default function ClosableBadge({
  href,
  text,
  color,
  badgeCookieData,
  onBadgeClose,
}) {
  const handleBadgeClose = () => {
    onBadgeClose(badgeCookieData);
  };

  return (
    <h5>
      <Badge pill variant="primary" style={{ backgroundColor: color }}>
        {href !== undefined && href !== null ? (
          <a
            className="ClosableBadge-Link"
            target="_blank"
            rel="noopener noreferrer"
            href={href}
          >
            {text}
          </a>
        ) : (
          text
        )}
        <Button
          data-testid="close-button"
          size="sm"
          onClick={handleBadgeClose}
          style={{ backgroundColor: color, borderColor: color }}
        >
          <FontAwesomeIcon icon={faTimesCircle} />
        </Button>
      </Badge>
    </h5>
  );
}
ClosableBadge.propTypes = {
  href: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
  badgeCookieData: PropTypes.object,
  onBadgeClose: PropTypes.func,
};
