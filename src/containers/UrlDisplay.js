import React from 'react'
import { InputGroup, FormControl, Button, OverlayTrigger, Tooltip } from 'react-bootstrap/'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const repoUrlParam = "u={user}&r={repo}"
const baseUrl = window.location.href.split("?")[0] + "?";

class UrlDisplay extends React.Component {

  constructor() {
    super();
    this.urlInput = React.createRef();
  }

  buildURL() {
    return baseUrl + 
      this.props.repos.map(repoDetails => 
        repoUrlParam.replace("{user}", repoDetails.username).replace("{repo}", repoDetails.repo)
        )
        .join("&")
  }

  copyToClipboard(event) {
    this.urlInput.current.select();
    document.execCommand("copy");
  }

  render() {
    let url = this.buildURL();
    return (
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="url">URL</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          readOnly
          aria-label="URL"
          value={url}
          ref={this.urlInput}
        />
        <InputGroup.Append>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250 }}
            overlay={<Tooltip>Copy URL</Tooltip>}
          >
            <Button variant="outline-secondary" onClick={this.copyToClipboard.bind(this)}>
              <FontAwesomeIcon icon={faCopy} />
            </Button>
          </OverlayTrigger>
          </InputGroup.Append>
      </InputGroup>
    )
  }
}

export default UrlDisplay