import React from 'react';
import { Form } from 'react-bootstrap'

export default function CandyMachineSettings({params, setParams}) {
  return (
    <div>
      <Form.Group className="mb-3" controlId="project-name">
        <Form.Label>Your Wallet Address</Form.Label>
        <Form.Control
          size="lg"
          onChange={(e) => {
            setParams({...params, extra: {...params.extra, walletAddress: e.target.value}});
          }}
          value={params.extra.walletAddress || ""}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="project-name">
        <Form.Label>Seller Fee Basis Points</Form.Label>
        <Form.Control
          size="lg"
          type="number"
          onChange={(e) => {
            setParams({...params, extra: {...params.extra, sellerFeeBasisPoints: e.target.value}});
          }}
          value={params.extra.sellerFeeBasisPoints || ""}
          placeholder="500"
        />
      </Form.Group>
    </div>
  );
}
