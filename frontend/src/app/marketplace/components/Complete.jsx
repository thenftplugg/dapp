import React from 'react';
import 'animate.css'
import { Card, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { buildRoute } from '../../auth/client/routes';

const Complete = (props) => {
  const [nft, setNft] = useState(null);
  const fetch = async () => {
    const response = await axios.get(buildRoute(`/marketplaces/${props.match.params.marketplaceSlug}/nfts/${props.match.params.nftId}`))
    setNft(response.data);
  }
  useEffect(() => {
    fetch();
  }, []);

  return (
    <Container className="pt-5">
      {nft && (
        <Row className="justify-content-center">
          <Col lg={4}>
            <Card className="fancy-card glow_up_box" body>
              <img src={nft.image_url} style={{width: "100%", height: "100%"}} />
              <div className="display-5"></div>
              <div className="fancy-text">Transaction: {nft.status}...</div>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Complete;
