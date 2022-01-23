import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ConnectToMetaMask from './ConnectToMetaMask';
import { getCurrentWalletConnected } from '../auth/metamask';


const Index = (props) => {
  const [wallet, setWallet] = useState(null);
  const onLoad = async () => {
    const { address } = await getCurrentWalletConnected();
    setWallet(address);
  }
  useEffect(() => {
    onLoad();
  }, []);
  return (
    <div>
      <Navbar fullWidth={true} />
      <div className="main-panel">
        <div className="content-wrapper">
          {!wallet && <ConnectToMetaMask onSet={(wallet, status) => {
            setWallet(wallet);
          }} />}
          {wallet && (
            <div>
              <h1>Choose a community</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Index;
