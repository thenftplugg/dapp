import React, { useState, useEffect } from 'react';
import axios from 'axios';
import web3 from 'web3';
import { buildRoute } from '../auth/client/routes';
import { Spinner } from 'react-bootstrap';
import { ERC721Contract, readContractState } from '../utils/erc721';
import { getCurrentWalletConnected } from '../auth/metamask';
import BuildABearContext from './context/BuildABearContext';
import BuildImage from './components/BuildImage';
import NameImage from './components/NameImage';
import ConnectToMetaMask from '../community/ConnectToMetaMask';
import { buildSelectedAssets, buildMetadata, urltoFile } from './utils';
import Footer from '../shared/Footer';

const BuildABear = ({marketplaceSlug}) => {
  const [marketplace, setMarketplace] = useState(null);
  const [composerAssetByLayerId, setComposerAssetByLayerId] = useState({});
  const [contractState, setContractState] = useState({});
  const [loading, setLoading] = useState({});
  const [baseUrl, setBaseUrl] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);
  const [form, setForm] = useState({});
  const [wallet, setWallet] = useState(null);

  const fetchMarketplace = () => {
    let path = `/marketplaces/${marketplaceSlug}`;
    axios.get(buildRoute(path))
      .then(function (response) {
        setMarketplace(response.data)
      }).catch((error) => {
        if (error.response) {
          console.error(error.response);
        }
      });
  }

  const readContractStateAndSave = async () => {
    if (marketplace) {
      const newContractState = await readContractState(marketplace?.contract.address, marketplace?.contract.chain);
      setContractState(newContractState);
      setForm({
        desciption: marketplace?.project?.name,
        compiler: "made with love by RareMints <3",
        edition: newContractState.totalSupply,
        image: `${newContractState.baseURI}${newContractState.totalSupply}.png`,
      })
    }
  }

  const onLoad = async () => {
    const { address } = await getCurrentWalletConnected();
    setWallet(address);
  }

  useEffect(() => {
    onLoad();
    fetchMarketplace();
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    readContractStateAndSave();
  }, [marketplace])

  if (!marketplace?.project || !marketplace.project?.groups) {
    return <Spinner />
  }

  const mintBear = async () => {
    if (loading.minting) return;

    setLoading({...loading, minting: true})
    const contract = new ERC721Contract(marketplace.contract.address, marketplace.contract.chain);
    const value = web3.utils.toHex(contractState.price.toString());

    // Mint the NFT
    const result = await contract.executeMint(1, value);
    if (!result.success) return;

    // Upload the data
    const formData = new FormData();
    const file = await urltoFile(baseUrl, 'image.png', 'image/png');
    formData.append("nft[image]", file);

    const selectedGroup = marketplace.project.groups[selectedGroupIndex % marketplace.project.groups.length];
    const selectedAssets = buildSelectedAssets({ selectedGroup: selectedGroup, composerAssetByLayerId })
    formData.append("nft[metadata]", JSON.stringify(buildMetadata(marketplace.project, selectedAssets)));
    formData.append("blockchain_transaction[transaction_hash]", result.transactionHash);
    const response = await axios.post(
      buildRoute(`/marketplaces/${marketplace.id}/builds/`),
      formData,
      { headers: {'Content-Type': 'multipart/form-data'} }
    )

    window.location.href = `/m/${marketplace.slug}/${response.data.id}`
  }

  const context = {
    marketplace,
    project: marketplace.project,
    currentStep,
    setCurrentStep,
    composerAssetByLayerId,
    setComposerAssetByLayerId,
    baseUrl,
    setBaseUrl,
    loading,
    form,
    setForm,
    selectedGroupIndex,
    setSelectedGroupIndex,
    wallet,
  };

  return (
    <div >
      <BuildABearContext.Provider value={context}>
        <div className="bg-marketplace" style={{minHeight: "90vh"}}>
          {currentStep === 0 && <BuildImage/>}
          {currentStep === 1 && <NameImage onMint={() => {
            if (!wallet) {
              setCurrentStep(2)
            } else {
              mintBear()
            }
          }}/>}
          {currentStep === 2 && <ConnectToMetaMask onSet={mintBear} />}
        </div>
      </BuildABearContext.Provider>
      <Footer />
    </div>
  )
}

export default BuildABear;
