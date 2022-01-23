import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { buildRoute } from '../auth/client/routes';

const ContractForm = ({project, walletAddress}) => {
  const [contractAddress, setContractAddress] = useState('')
  const createContract = async () => {
    const response = await axios.post(
      buildRoute(`/editor/projects/${project.id}/contracts`),
      {
        address: contractAddress,
        contract_type: 'erc721',
        chain: 'rinkeby'
      }
    )
    debugger
    if (response) {
      window.location.href.reload()
    }
  }
  return (
    <div>
      <div className="display-4 mb-4">
        Attach Contract to <b>{project.name}</b>
        <Card>
          <Card.Body>
            <h5>Create Contract for Project</h5>
            <Form.Group>
              <Form.Label>Contract Address</Form.Label>
              <Form.Control
                size="lg"
                placeholder="Ex: 0x0000000000000000000000000000000000000000"
                value={contractAddress}
                onChange={(e) => {
                  setContractAddress(e.target.value)
                }}
              />
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <Button block onClick={async () => {
              createContract();
            }}>
              Submit
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}

export default ContractForm;
