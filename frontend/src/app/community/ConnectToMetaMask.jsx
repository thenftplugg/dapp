import React, { useState, useEffect, useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { connectWallet } from '../auth/metamask';
import CommunityContext from './context';


const ConnectToMetaMask = ({ onSet, compact=false }) => {
  const { wallet } = useContext(CommunityContext);
  const [status, setStatus] = useState(null);
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    onSet(walletResponse.address);
    setStatus(walletResponse.status);
  };

  return (
    <div style={{textAlign: "-webkit-center"}}>
      <Card body className="text-center" style={{maxWidth: "fit-content"}}>
        {!compact && (
          <img className="px-3" height="200" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png" />
        )}
        <div>
          <Button
            variant="inverse-primary"
            className="no-border-radius"
            onClick={connectWalletPressed}
          >
            Connect to Metamask
          </Button>
        </div>
      </Card>
      {status}
    </div>
  );
}

export default ConnectToMetaMask;
