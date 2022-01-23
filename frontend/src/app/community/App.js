import React, { useState, useEffect, useContext } from 'react';
import CommunityContext from './context';
import { getCurrentWalletConnected } from '../auth/metamask';
import ChooseYourToken from './ChooseYourToken';
import Community from './Community';
import axios from 'axios';
import { buildRoute } from '../auth/client/routes';
import ConnectToMetaMask from './ConnectToMetaMask';
import Spinner from "../shared/Spinner";
import { ImageCache } from '../utils/erc721';


const Index = (props) => {
  // 1. Check if contract exists.
  // 2. Connect to metamask.
  // 2. Validate nonce.
  // 3. Get tokens for the user.
  // 4. Make user select a token_identifier.
  const contractAddress = props.match.params.communityId;
  const [loading, setLoading] = useState(true);
  const [contractFound, setContractFound] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [chosenToken, setChosenToken] = useState(null);
  const [community, setCommunity] = useState(null);
  const [error, setError] = useState(null);
  const [imageCache, setImageCache] = useState(
    new ImageCache(contractAddress, {}, props.chain),
  );
  const onLoad = async () => {
    const { address } = await getCurrentWalletConnected();
    setWallet(address);
  }


  useEffect(() => {
    onLoad();
    let communityUrl = `/community/${props.match.params.communityId}`;
    if (props.chain) communityUrl = `/community/${props.match.params.communityId}?chain=${props.chain}`
    axios.get(buildRoute(communityUrl)).then((response) => {
      setLoading(false);
      setContractFound(true);
      setCommunity(response.data);
    }).catch((error) => {
      setContractFound(false);
      setLoading(false);
      if (!error.response) {
        setError("Something went wrong")
      } else if (error.response.status === 404) {
        setError("Contract not found :(")
      } else {
        setError("Something went wrong, try again!")
      }
    });
  }, []);

  let view;
  if (loading) {
    view = (
      <div className="p-6 text-center">
        <Spinner />
      </div>
    )
  } else {
    view = (
      <>
        {contractFound ? (
          <CommunityContext.Provider value={{
            chain: props.chain,
            community: community,
            imageCache: imageCache,
            setImageCache: setImageCache,
            contractAddress: contractAddress,
            wallet: wallet,
            chosenToken: chosenToken,
          }}>
            {!wallet && <ConnectToMetaMask onSet={(wallet, status) => {
              setWallet(wallet);
            }} />}
            {wallet && !chosenToken &&
              <ChooseYourToken
                contractAddress={contractAddress}
                setChosenToken={(token) => {
                  setChosenToken(token);
                }}
                chosenToken={chosenToken}
              />
            }
            {chosenToken && <Community />}
          </CommunityContext.Provider>
        ) : (
          <div className="p-6 text-center">
            {error}
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <div id="community">
        <div className="content-wrapper">
          {view}
        </div>
        <footer className="mb-5 mt-2 text-center">A private space for your NFT community.</footer>
      </div>
    </div>
  );
}

export default Index;
