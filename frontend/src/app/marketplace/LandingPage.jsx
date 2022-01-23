import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { Button, Row, Container, Col, Image } from 'react-bootstrap';
import { buildRoute } from '../auth/client/routes';


const LandingPage = (props) => {
  const fetchMarketplace = async () => {
    const response = await axios.get(buildRoute('/marketplaces?filter=featured'));
    const marketplaces = response.data['results'];
    console.log(marketplaces[0].project)
  }
  useEffect(() => {
    fetchMarketplace();
  }, []);
  return (
    <div className="main-panel">
      <div className="mt-5 pt-5">
        <Container>
          <Row>
            <Col md={5}>
              <div>
                <div className="display-2 mb-4 font-weight-bold">NFT's for Communities</div>
                <div className="h3 mb-4 subtext">
                  Create. Buy. Sell and Earn with NFTs.<br/>
                  Faster and cheaper fees under $1.<br/>
                  Stake your earnings and earn more.<br/>
                </div>
                <div className="d-flex mb-4" style={{justifyContent: 'space-between'}}>
                  <Button size="lg" variant="info" className="call-to-action">
                    Browse NFTs
                  </Button>
                  <Button variant="outline-info" size="lg" className="call-to-action">
                    I'm a Creator
                  </Button>
                </div>
              </div>
            </Col>

            <Col md={7}>
              <div style={{height: '50%'}}>
                <Row className="float-right mb-3">
                  <Col xs="auto">
                    <Image className="rounded-2" src="/images/0.png" style={{
                      width: '225px', height: '250px', objectFit: 'cover'
                    }} />
                  </Col>
                  <Col xs="auto">
                    <Image className="rounded-2" src="/images/1.png" style={{
                      width: '225px', height: '250px', objectFit: 'cover'
                    }} />
                  </Col>
                </Row>
              </div>
              <div style={{height: '50%'}}>
                <Row className="float-right">
                  <Col xs="auto">
                    <Image className="rounded-2" src="/images/2.png" style={{
                      width: '225px', height: '250px', objectFit: 'cover'
                    }} />
                  </Col>
                  <Col xs="auto">
                    <Image className="rounded-2" src="/images/3.png" style={{
                      width: '225px', height: '250px', objectFit: 'cover'
                    }} />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default LandingPage;
