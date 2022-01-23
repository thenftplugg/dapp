import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { buildRoute } from '../auth/client/routes';
import CommunityContext from './context';
import Spinner from "../shared/Spinner";
import Slider from "react-slick";

const ChooseYourToken = ({ contractAddress, setChosenToken, chosenToken }) => {
  const { wallet, imageCache, setImageCache, community, chain } = useContext(CommunityContext);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const downloadImages = async (tokens) => {
    if (tokens.length === 1) {
      setChosenToken(tokens[0]);
    }
    const tokenIds = tokens.map(t => t.token_id);
    const newImageCache = await imageCache.addToCache(tokenIds);
    setImageCache(newImageCache);
  }

  useEffect(() => {
    axios.get(buildRoute(`/nft/${wallet}/?chain=${chain}`))
      .then(response => {
        const newTokens = response.data.result.filter(r => r.token_address.toLowerCase() === contractAddress.toLowerCase());
        setTokens(newTokens);
        downloadImages(newTokens).then(r => setLoading(false));
      })
      .catch(error => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-6 text-center">
      <Spinner />
    </div>
  )

  if (tokens.length == 0) return (
    <div className="p-6 text-center">
      You need a{['a', 'e', 'i', 'o', 'u'].indexOf(community.name[0]?.toLowerCase()) === -1 ? "" : "n"} {community.name} NFT to view this page!
    </div>
  )

  return (
    <div className="my-2">
      <div className="display-3 text-center mb-5">Choose your avatar</div>
      {tokens.length > 1 ? (
        <Slider
          dot={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
        >
          {tokens.map((t, index) =>
            <div>
              <div className="text-center d-flex" style={{placeContent: "center ", width: "100%"}}>
                <Image
                  key={index}
                   onClick={() => {
                    setChosenToken(t);
                  }}
                  src={imageCache.get(t.token_id)}
                  style={chosenToken?.token_id === t.token_id ? {width: 200} : {width: 180}}
                  className={`${chosenToken?.token_id === t.token_id && "border border-success animate__animated animate__pulse"} mx-2 pointer rounded `}
                />
              </div>
            </div>
          )}
        </Slider>
      ) : (
        <Image
           onClick={() => {
            setChosenToken(tokens[0]);
          }}
          src={imageCache.get(tokens[0].token_id)}
          className="mx-2 pointer rounded"
        />
      )}
    </div>
  );
}

export default ChooseYourToken;
