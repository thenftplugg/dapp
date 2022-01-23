import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { buildRoute } from '../auth/client/routes';
import Footer from '../shared/Footer';
import Spinner from '../shared/Spinner';
import CategorySlider from './components/CategorySlider';

const buildFeature = (marketplace, headerSize=6) => (
  <div className="slide_wrapper">
    <div className={`ml-2 pb-2 h${headerSize}`}>{marketplace.project.name}</div>
    <div className="slide_preview" style={{"--nft-image": `url(${marketplace.project.profile_image_url})` }}>
    </div>
  </div>
);

const Index = (props) => {
  const [featuredMarketplaces, setFeaturedMarketplaces] = useState([]);
  const fetchMarketplaces = async (filter) => {
    return (await axios.get(buildRoute(`/marketplaces?filter=${filter}`))).data.results
  }
  const fetchAllMarketplaces = async () => {
    setFeaturedMarketplaces(await fetchMarketplaces('featured'));
  }

  useEffect(() => {
    fetchAllMarketplaces();
  }, []);

  const isSmallScreen = useMediaQuery({ query: '(max-width: 607px)' });
  const tempMarketplaces = [1,2,3,4].map(x => featuredMarketplaces[0]);

  if (!featuredMarketplaces.length) return <Spinner />;

  return (
    <div>
      <div style={{padding: "1em 2.3em", minHeight: "90vh"}} className="bg-marketplace">
        <h4>🧸 Build your bear!</h4>
        {isSmallScreen ? (
          <div>
            <div onClick={() => window.location.href = "/m/" + featuredMarketplaces[0].slug}>
              {buildFeature(featuredMarketplaces[0], 1)}
            </div>
            <div className="py-2">
              <CategorySlider marketplaces={tempMarketplaces} />
            </div>
          </div>
        ) : (
          <Row className="my-2">
            <Col xs={12} lg={6} className="my-2" onClick={() => window.location.href = "/m/" + featuredMarketplaces[0].slug}>
              {buildFeature(featuredMarketplaces[0], 1)}
            </Col>
            <Col lg={6} xs={12} className="my-2">
              <div className="d-flex flex-wrap h-100 justify-content-around">
                {tempMarketplaces.map(marketplace => (
                  <div style={{minWidth: "21vw"}} onClick={() => window.location.href = "/m/" + marketplace.slug}>
                    {buildFeature(marketplace)}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Index;
