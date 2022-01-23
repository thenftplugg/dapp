import React from 'react';
import { Collapse, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap'


export default function ChooseBlockchain ({params, setParams}) {
  return (
    <div className="form-group">
      <Row>
        <Col>
          <div className="form-check pointer">
            <label className="form-check-label pointer">
              <input
                type="radio"
                className="form-check-input"
                name="optionsRadios"
                onChange={(e) => {
                  if (e.target.checked) {
                    setParams({...params, target: 'erc721'})
                  }
                }}
                checked={params.target === 'erc721'}
              />
              <i className="input-helper"></i>
              ERC721
            </label>
          </div>
        </Col>
        <Col>
          <div className="form-check pointer">
            <label className="form-check-label pointer">
              <input
                type="radio"
                className="form-check-input"
                name="optionsRadios"
                onChange={(e) => {
                  if (e.target.checked) {
                    setParams({...params, target: 'candy_machine'})
                  }
                }}
                checked={params.target === 'candy_machine'}
              />
              <i class="input-helper"></i>
              Solana
            </label>
          </div>
        </Col>
      </Row>
    </div>

  );
}
