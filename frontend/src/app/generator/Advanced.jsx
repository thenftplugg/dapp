import React, { useState } from 'react';
import { Collapse, Row, Col, Form } from 'react-bootstrap'


export default function Advanced({params, setParams}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
      >
        Advanced
      </a>
      <Collapse in={open}>
        <Row className="mt-3">
          <Col>
            <div className="display-5 mb-3">
              Generate in Batches
            </div>
          </Col>
          <Col md="auto">
            <Form.Group className="mb-3">
              <Form.Control
                size="lg"
                type="number"
                onChange={(e) => {
                  setParams({...params, generateInBatches: e.target.value});
                }}
                value={params.generateInBatches}
                placeholder="100"
              />
            </Form.Group>
          </Col>
        </Row>
      </Collapse>
    </div>
  );
}
