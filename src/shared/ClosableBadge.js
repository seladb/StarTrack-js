import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button } from 'react-bootstrap/'

const ClosableBadge = (props) => {

  const handleBadgeClose = () => {
    props.onBadgeClose(props.badgeCookieData)
  }

  return (
    <h5>
      <Badge pill variant="primary" style={{backgroundColor: props.color}}>
        {props.text}
        <Button size="sm" onClick={handleBadgeClose} style={{backgroundColor: props.color, borderColor: props.color}}>
          <FontAwesomeIcon icon={faTimesCircle} />
          </Button>
      </Badge>
    </h5>
  )
}

export default ClosableBadge