import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../shared/Navbar';
import ConnectToMetaMask from '../community/ConnectToMetaMask';
import { getCurrentWalletConnected } from '../auth/metamask';
import { Image, Container, Button, Card, Col, ProgressBar, Row, Form, Badge, Spinner } from 'react-bootstrap';
import web3 from 'web3';
import axios from 'axios';
import { buildRoute } from '../auth/client/routes';
import { ERC721Contract, readContractState } from '../utils/erc721';
import RotatingImage from '../projects/RotatingImage';
import ContractForm from './ContractForm';

const NUM_RECENTS_TO_SHOW = 5;

const ImageFromMetadataUri = ({url}) => {
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    axios.get(url).then((response) => {
      setImageUrl(response.data.image)
    })
  }, []);
  return <div>
    <Image height="100" width="auto" src={imageUrl} />
  </div>
}

const ManagementPanel = (props) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [contractState, setContractState] = useState({});
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState({contractState: true});
  const [newPrice, setNewPrice] = useState('');
  const [airdrop, setAirdrop] = useState({});
  const onLoad = async () => {
    const { address } = await getCurrentWalletConnected();
    setWalletAddress(address);
  }
  const loadProject = () => {
    let path = `/editor/projects/${props.match.params.projectId}/`
    axios.get(buildRoute(path))
      .then(function(response) {
        setProject(response.data)
      });
  }
  const readContractStateAndSave = async (contractData) => {
    const contractState = await readContractState(contractData.address, contractData.chain)
    setNewPrice(web3.utils.fromWei(contractState.price));
    setContractState(contractState);
    setLoading({...loading, contractState: false})
  }
  useEffect(() => {
    if (project?.contract) {
      readContractStateAndSave(project.contract);
    }
  }, [project])

  useEffect(() => {
    onLoad();
    loadProject();
  }, []);

  const createContractForProject = async (contractAddress, chain='matic') => {
    const contract = new ERC721Contract(contractAddress, chain);
    const symbol = contract.fetchSymbol();
    const name = contract.fetchName();
    const balance = contract.fetchBalance();
    const response = await axios.post(buildRoute("/contracts"), {
      symbol: symbol,
      name: name,
      address: contractAddress,
      chain: chain === 'matic' ? 'polygon' : 'eth',
      contract_type: 'ERC721',
    })
  }
  const executeWithdraw = async () => {
    const contract = new ERC721Contract(project.contract.address, project.contract.chain);
    await contract.executeWithdraw();
  }

  const executeSetPrice = async () => {
    const contract = new ERC721Contract(project.contract.address, project.contract.chain);
    const newPriceInWei = web3.utils.toWei(newPrice, 'ether')
    await contract.executeSetPause(newPriceInWei);
  }

  const executeSetPause = async () => {
    const contract = new ERC721Contract(project.contract.address, project.contract.chain);
    await contract.executeSetPause(!contractState.isPaused);
  }

  const executeAirdrop = async () => {
    const contract = new ERC721Contract(project.contract.address, project.contract.chain);
    await contract.executeAirdrop(airdrop.address, airdrop.size);
  }
  const executeMint = async () => {
    const contract = new ERC721Contract(project.contract.address, project.contract.chain);
    const value = web3.utils.toHex(contractState.price.toString());
    await contract.executeMint(1, value);
  }

  return <div>
    <Navbar />
    <div className="mt-5 content-wrapper page-body-wrapper">
      <Container>
        <div>
          {!walletAddress && (
            <ConnectToMetaMask compact={true} onSet={(address) => {
              setWalletAddress(address)
            }} />
          )}
          {(loading.contractState || !project) && (
            <Spinner />
          )}
          {walletAddress && project && !project.contract && (
            <ContractForm walletAddress={walletAddress} project={project} />
          )}
          {walletAddress && project && project.contract && (
            <div>
              {!loading.contractState && (
                <div>
                  <div className="display-4 mb-4">
                    Manage {contractState.name} (${contractState.symbol})
                  </div>
                  <Row className="mb-4">
                    <Col className="grid-margin stretch-card">
                      <Card>
                        <Card.Body>
                          <h5>Balance</h5>
                          <div className="display-2 my-4 mt-5 text-center">
                            {web3.utils.fromWei(contractState.balance, 'ether')} Ξ
                          </div>
                        </Card.Body>
                        <Card.Footer>
                          <Button disabled={loading.withdraw} block onClick={async () => {
                            if (loading.withdraw) return;
                            setLoading({ ...loading, withdraw: true })
                            await executeWithdraw();
                            setLoading({ ...loading, withdraw: false })
                          }}>
                            Withdraw
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                    <Col className="grid-margin stretch-card">
                      <Card>
                        <Card.Body>
                          <div>
                            <span className="h5">
                              Sales
                            </span>
                            {contractState.isPaused ? (
                              <Badge className="ml-3" variant="danger">Paused</Badge>
                            ) : (
                              <Badge className="ml-3" variant="success">Active</Badge>
                            )}
                          </div>
                          <div className="mb-4">
                            <div className="text-muted text-right">{contractState.totalSupply} / {contractState.maxSupply}</div>
                            <ProgressBar now={contractState.totalSupply / contractState.maxSupply * 100} />
                          </div>
                          <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                              size="lg"
                              placeholder="Price"
                              value={newPrice}
                              onChange={(e) => {
                                setNewPrice(e.target.value)
                              }}
                            />
                          </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                          <div className="d-flex flex-row justify-content-between">
                            <Button
                              disabled={loading.price}
                              onClick={async () => {
                                if (loading.price) return;
                                setLoading({ ...loading, price: true });
                                await executeSetPrice();
                                setLoading({ ...loading, price: false });
                              }} variant="primary">Update Price</Button>
                            <Button
                              variant={contractState.isPaused ? "success" : "danger"}
                              disabled={loading.pause}
                              onClick={async () => {
                                if (loading.pause) return;
                                setLoading({ ...loading, pause: true })
                                await executeSetPause();
                                setLoading({ ...loading, pause: false })
                              }}>{contractState.isPaused ? "Resume Sales" : "Pause Sales"}</Button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                    <Col className="grid-margin stretch-card">
                      <Card>
                        <Card.Body>
                          <h5>Airdrop</h5>
                          <Form.Group>
                            <Form.Control
                              size="lg"
                              placeholder={walletAddress}
                              value={airdrop.address}
                              onChange={(e) => {
                                setAirdrop({ ...airdrop, address: e.target.value })
                              }}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Control
                              size="lg"
                              type="number"
                              placeholder="amount"
                              value={airdrop.size}
                              onChange={(e) => {
                                setAirdrop({ ...airdrop, size: e.target.value })
                              }}
                            />
                          </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                          <Button disabled={loading.airdrop} onClick={async () => {
                            if (loading.airdrop) return;
                            setLoading({ ...loading, airdrop: true })
                            await executeAirdrop();
                            setLoading({ ...loading, airdrop: false })
                          }} block>
                            Send
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col className="grid-margin stretch-card">
                      <Card>
                        <Card.Body>
                          <h5>Recent Mints</h5>
                          <div className="preview-list max-height-400">
                            {Array.from(Array(NUM_RECENTS_TO_SHOW)).map((_, n) => {
                              const idx = contractState.totalSupply - n;
                              if (idx < 0) return;
                              const url = contractState.baseURI + idx;
                              return (
                                <Row className="preview-item border-bottom">
                                  <Col xs="auto">
                                    <ImageFromMetadataUri url={url} />
                                  </Col>
                                  <Col>
                                    <h4>#{idx}</h4>
                                  </Col>
                                </Row>
                              );
                            }).filter(_ => _)}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col className="grid-margin stretch-card">
                      <Card>
                        <Card.Body>
                          <div className="text-center">
                            <RotatingImage project={project} rotating={true} style={{ maxWidth: '350px' }} />
                          </div>
                        </Card.Body>
                        <Card.Footer>
                          <Button disabled={loading.mint} block onClick={async () => {
                            setLoading({ ...loading, mint: true })
                            await executeMint();
                            setLoading({ ...loading, mint: false })
                          }}>Mint</Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  </div>
}

export default ManagementPanel;
