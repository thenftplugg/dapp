import React from 'react';
import { Alert, Button, Row, Col } from 'react-bootstrap';

export default function PromotionalAlert(props) {
  return (
    <div>
      <Alert className="mt-2" variant="light">
        <div className="display-5">
          <Row>
            <Col xs="auto">
              <i className="mdi mdi-diamond-stone mr-1 display-4 text-info" />
            </Col>
            <Col>
              Want new ways to sell NFT's? We're looking for partners to help beta test our one-click NFT deployment and marketplace tools!
              <br />
              <br />
              <a className="mt-2 btn btn-info" target="_blank" href="https://form.jotform.com/220086295548058">I'm interested!</a>
            </Col>
          </Row>
        </div>
      </Alert>
    </div>
  )
}