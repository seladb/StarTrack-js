import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button } from 'react-bootstrap/'

class ClosableBadge extends React.Component {

  handleBadgeClose() {
    this.props.onBadgeClose(this.props.badgeCookieData)
  }

  render() {
    return (
      <h5>
        <Badge pill variant="primary">
          {this.props.text}
          <Button size="sm" onClick={this.handleBadgeClose.bind(this)}>
            <FontAwesomeIcon icon={faTimesCircle} />
           </Button>
        </Badge>
      </h5>
    )

  }
}

export default ClosableBadge