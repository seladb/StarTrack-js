import React, { useRef } from 'react'
import { InputGroup, FormControl, Button, OverlayTrigger, Tooltip } from 'react-bootstrap/'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const repoUrlParam = "r={user},{repo}";
const baseUrl = window.location.origin + window.location.pathname + "#/preload?";

const UrlDisplay = (props) => {

  const urlInput = useRef();

  const buildURL = () => {
    return baseUrl + 
      props.repos.map(repoDetails => 
        repoUrlParam.replace("{user}", repoDetails.username).replace("{repo}", repoDetails.repo)
      )
      .join("&")
  }

  const copyToClipboard = () => {
    urlInput.current.select();
    document.execCommand("copy");
  }

  return (
    <InputGroup className="mb-3 mt-5">
      <InputGroup.Prepend>
        <InputGroup.Text id="url">URL</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        readOnly
        aria-label="URL"
        value={buildURL()}
        ref={urlInput}
      />
      <InputGroup.Append>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250 }}
          overlay={<Tooltip>Copy URL</Tooltip>}
        >
          <Button variant="outline-secondary" onClick={copyToClipboard}>
            <FontAwesomeIcon icon={faCopy} />
          </Button>
        </OverlayTrigger>
        </InputGroup.Append>
    </InputGroup>
  )
}

export default UrlDisplay