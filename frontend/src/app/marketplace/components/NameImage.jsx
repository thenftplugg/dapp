import React, { useContext } from 'react';
import { Button, Row, Col, Container, FormControl, FormLabel, FormGroup, Card } from 'react-bootstrap'
import BuildABearContext from '../context/BuildABearContext';

const NameImage = ({onMint}) => {
  const {
    project,
    baseUrl,
    loading,
    form,
    setForm,
  } = useContext(BuildABearContext)

  return (
    <Container className="pt-5">
      <Row>
        <Col md={6} className="my-2">
          <img src={baseUrl} style={{width: "100%"}} />
        </Col>
        <Col md={6} className="my-2">
          <h1 className="mb-1">{project.name}</h1>
          <FormGroup controlId="name">
            <FormLabel>Name your creation!</FormLabel>
            <FormControl value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}/>
          </FormGroup>
          <Button className="float-right" variant="info" size="lg" disabled={loading.minting} onClick={onMint}>
            Mint!
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default NameImage;
