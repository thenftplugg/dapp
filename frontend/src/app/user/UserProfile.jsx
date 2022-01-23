import React, { useContext, useState } from 'react';
import { Card, Modal, Form, Button, InputGroup } from 'react-bootstrap'
import axios from 'axios';
import { buildRoute } from '../auth/client/routes';


export default function UserProfile({show, setShow, user}) {
  const [isSaving, setIsSaving] = useState(false);
  const [userForm, setUserForm] = useState(user);
  

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control value={user.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control disabled value={user.email} />
            </Form.Group>

            <Button variant="success" type="submit" disabled={isSaving} onClick={() => console.log("save")}>
              { !isSaving && "Save" }
              { isSaving && "..." }
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Modal>
  )
}