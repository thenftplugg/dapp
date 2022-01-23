import axios from 'axios';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Navbar from '../shared/Navbar';
import React, { useState, useEffect } from 'react';
import { Table, Card, Container, Pagination, Row } from 'react-bootstrap';
import { buildRoute } from '../auth/client/routes';
import Web3 from 'web3';

TimeAgo.addDefaultLocale(en);

const App = () => {
  const timeAgo = new TimeAgo('en-US')
  const [contracts, setContracts] = useState([])
  const [pagination, setPagination] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const currentPage = searchParams.get('page') || 1;
  useEffect(() => {
    axios.get(buildRoute(`/contracts/?page=${currentPage}`)).then((response) => {
      setContracts(response.data.results);
      setPagination({
        count: response.data.count,
        previous: response.data.previous,
        next: response.data.next,
      })
    })
  }, []);

  return (
    <div>
      <Navbar fullWidth={true} />
      <div className="main-panel">
        <div className="content-wrapper">
          <Card>
            <Card.Body>
              <Card.Title>
                Recently Created ERC721 Tokens
              </Card.Title>
              <Table>
 
                <tbody>
                
                  {contracts.map(contract => {
                    const etherscan = `https://etherscan.io/address/${contract.address}`;
                    const canvas = `/c/${contract.address}`;
                    return (
                      <>
                      <tr className="card-body">
                        <td>
                          <h4 className="d-lg-none">{contract.name.substr(0, 20)}{contract.name.length > 20 ? "..." : ""}</h4>
                          <h4 className="d-none d-lg-block">{contract.name}</h4>
                          <Row>
                            <div className="col-md mb-2 mb-md-0 d-flex">
                              <div className="d-inline-flex align-items-center justify-content-center border rounded-circle px-2 py-2 my-auto text-muted">
                                <i className="mdi mdi-newspaper icon-sm my-0 "></i>
                              </div>
                              <div className="wrapper pl-3">
                                <p className="mb-0 font-weight-medium text-muted">${contract.symbol}</p>
                                <h4 className="font-weight-semibold mb-0">Block {contract.block_number}</h4>
                              </div>
                            </div>
                            <div className="col-md mb-2 mb-md-0 d-flex">
                              <div className="d-inline-flex align-items-center justify-content-center border rounded-circle px-2 py-2 my-auto text-muted">
                                <i className="mdi mdi-timer-sand icon-sm my-0 "></i>
                              </div>
                              <div className="wrapper pl-3">
                                <p className="mb-0 font-weight-medium text-muted">TIME</p>
                                <h4 className="font-weight-semibold mb-0">{timeAgo.format(new Date(contract.block_timestamp * 1000))}</h4>
                              </div>
                            </div>
                            <div className="col-md mb-2 mb-md-0 d-flex">
                              <div className="d-inline-flex align-items-center justify-content-center border rounded-circle px-2 py-2 my-auto text-muted">
                                <i className="mdi mdi-format-paint icon-sm my-0 "></i>
                              </div>
                              <div className="wrapper pl-3">
                                <p className="mb-0 font-weight-medium text-muted">COMMUNITY</p>
                                <h4 className="font-weight-semibold mb-0">
                                  <a href={canvas}>View Canvas</a>  
                                </h4>
                              </div>
                            </div>
                            <div className="col-md mb-2 mb-md-0 d-flex">
                              <div className="d-inline-flex align-items-center justify-content-center border rounded-circle px-2 py-2 my-auto text-muted">
                                <i className="mdi mdi-ethereum icon-sm my-0 "></i>
                              </div>
                              <div className="wrapper pl-3">
                                <p className="mb-0 font-weight-medium text-muted">ETHERSCAN</p>
                                <h4 className="font-weight-semibold mb-0 text-primary">
                                  <a target="_blank" href={etherscan}>
                                    View Contract
                                  </a>
                                </h4>
                              </div>
                            </div>
                          </Row>
                        </td>
                      </tr>
                      
                    </>
                    );
                  })}
                </tbody>
              </Table>
              {pagination && (
                <div className="mt-4 text-center">
                  <Pagination>
                    { pagination.previous && (
                      <Pagination.Prev onClick={() => {
                        window.location.href = `/scanner?page=${parseInt(currentPage, 10) - 1}`;
                      }} />
                    )}
                    <Pagination.Item active={true}>
                      {currentPage}
                    </Pagination.Item>
                    { pagination.next && (
                      <Pagination.Next onClick={() => {
                        window.location.href = `/scanner?page=${parseInt(currentPage, 10) + 1}`;
                      }} />
                    )}
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;