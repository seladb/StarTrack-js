import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Form, Modal, Container, Button, Col, Alert } from "react-bootstrap/";

const checkBoxDefaultLabel = "Display forecast";
const minForecastBackwardsDays = 10;
const minForecastForwardDays = 10;
const maxForecastForwardDays = 365 * 10;

const ForecastChooser = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [checkBoxLabel, setCheckBoxLabel] = useState(checkBoxDefaultLabel);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const forecastBasedOnLastInput = useRef();
  const forecastBasedOnLastSelect = useRef();
  const forecastForwardInput = useRef();
  const forecastForwardSelect = useRef();
  const forecastValues = useRef();
  const forecastCheckBox = useRef();

  const onForecastCheckBoxChanged = (event) => {
    if (event.target.checked) {
      setShowModal(true);
      setShowAlert(false);
    } else {
      setCheckBoxLabel(checkBoxDefaultLabel);
      props.onForecastProps(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCheckBoxLabel(checkBoxDefaultLabel);
    forecastCheckBox.current.checked = false;
    props.onForecastProps(null);
    setShowAlert(false);
  };

  const calculateDays = (input, select) => {
    switch (select) {
      case "Days":
        return parseInt(input);
      case "Weeks":
        return input * 7;
      case "Months": {
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - input);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        return Math.round(Math.abs((now - monthsAgo) / oneDay));
      }
      case "Years":
        return input * 365;
      default:
        return parseInt(input);
    }
  };

  const validateForecastPropsData = (forecastProps) => {
    if (forecastProps.daysBackwards < minForecastBackwardsDays) {
      setShowAlert(true);
      setAlertText("The forecast must be based on at least 10 days of data");
      return false;
    }
    if (forecastProps.daysForward < minForecastForwardDays) {
      setShowAlert(true);
      setAlertText("The forecast must show at least 10 days forward");
      return false;
    }
    if (forecastProps.daysForward > maxForecastForwardDays) {
      setShowAlert(true);
      setAlertText("The forecast cannot show more than 10 years forward");
      return false;
    }

    return true;
  };

  const forecastPropsSelected = (event) => {
    event.preventDefault();
    const forecastProps = {
      daysBackwards: calculateDays(
        forecastBasedOnLastInput.current.value,
        forecastBasedOnLastSelect.current.value
      ),
      daysForward: calculateDays(
        forecastForwardInput.current.value,
        forecastForwardSelect.current.value
      ),
      numValues: parseInt(forecastValues.current.value),
    };
    if (!validateForecastPropsData(forecastProps)) {
      return;
    }

    const checkBoxNewLabel = `Display ${forecastForwardInput.current.value} ${forecastForwardSelect.current.value} forecast based on the last ${forecastBasedOnLastInput.current.value} ${forecastBasedOnLastSelect.current.value}`;
    setCheckBoxLabel(checkBoxNewLabel);
    setShowModal(false);
    props.onForecastProps(forecastProps);
  };

  return (
    <Container>
      <Form>
        <h3>Forecast</h3>
        <Form.Check
          custom
          type="checkbox"
          ref={forecastCheckBox}
          id="display-forecast-checkbox"
          label={checkBoxLabel}
          onChange={onForecastCheckBoxChanged}
        />
      </Form>
      <Modal show={showModal} onHide={closeModal}>
        <Form onSubmit={forecastPropsSelected}>
          <Modal.Header closeButton>
            <Modal.Title>Forecast Properties</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Display forecast based on the last:</Form.Label>
              <Form.Row>
                <Col>
                  <Form.Control
                    ref={forecastBasedOnLastInput}
                    type="number"
                    min="1"
                    defaultValue="3"
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    ref={forecastBasedOnLastSelect}
                    as="select"
                    defaultValue="Months"
                  >
                    <option>Days</option>
                    <option>Weeks</option>
                    <option>Months</option>
                    <option>Years</option>
                  </Form.Control>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>Display forecast ahead:</Form.Label>
              <Form.Row>
                <Col>
                  <Form.Control
                    ref={forecastForwardInput}
                    type="number"
                    min="1"
                    defaultValue="3"
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    ref={forecastForwardSelect}
                    as="select"
                    defaultValue="Months"
                  >
                    <option>Days</option>
                    <option>Weeks</option>
                    <option>Months</option>
                    <option>Years</option>
                  </Form.Control>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>Number of forecast values to calculate:</Form.Label>
              <Form.Control
                ref={forecastValues}
                type="number"
                min="10"
                max="100"
                defaultValue="10"
                required
              />
            </Form.Group>
            <p>
              The forecast is based on{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://en.wikipedia.org/wiki/Linear_least_squares"
              >
                Linear Least Squares
              </a>{" "}
              which creates a regression line from the existing stargazer data
              and extends this line into the future
            </p>
            <Form.Group>
              <Alert variant="danger" show={showAlert}>
                {alertText}
              </Alert>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Ok
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};
ForecastChooser.propTypes = {
  onForecastProps: PropTypes.func,
};

export default ForecastChooser;
