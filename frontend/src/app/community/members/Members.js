import axios from 'axios';
import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { ERC721Contract } from '../../utils/erc721';
import { Row, Col } from 'react-bootstrap'
import CommunityContext from '../context';
import Spinner from '../../shared/Spinner';

const PER_PAGE = 10;
const MemberProfile = ({tokenId}) => {
  const { imageCache, setImageCache } = useContext(CommunityContext);

  return (
    <div>
      <img src={imageCache.get(tokenId)} />
    </div>
  );
}

const Members = () => {
  const { imageCache, setImageCache } = useContext(CommunityContext);
  const [loading, _setLoading] = useState(true);
  const [tokenIds, setTokenIds] = useState([]);
  const [page, _setPage] = useState(null);
  const pageRef = useRef(page);
  const loadingRef = useRef(loading);
  const setLoading = (newValue) => {
    loadingRef.current = newValue
    _setLoading(newValue)
  }
  const setPage = (newValue) => {
    pageRef.current = newValue
    _setPage(newValue)
  }
  const getAllUrls = async () => {
    const results = await imageCache.contract.getAllUrls();
    const tokenIds = results.map((r) => {
      return r.topics[3];
    });
    setTokenIds(tokenIds);
    setPage(0);
  }
  const downloadImages = async () => {
    setLoading(true);
    const tokenIdsToDownload = tokenIds.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
    const newImageCache = await imageCache.addToCache(tokenIdsToDownload);
    setImageCache(newImageCache);
    setLoading(false);
  }

  const loadMoreTokens = useCallback(() => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (!loadingRef.current) {
        setPage(pageRef.current + 1);
      }
    }
  });
  useEffect(() => {
    downloadImages();
  }, [page]);

  useEffect(() => {
    window.addEventListener('scroll', loadMoreTokens)
    getAllUrls();
  }, [], () => {
    window.removeEventListener('scroll', loadMoreTokens)
  });

  const end = PER_PAGE * (page + 1);
  const tokenIdsToShow = tokenIds.slice(0, end)

  return (
    <div>
      <Row>
        {tokenIdsToShow.map((tokenId) => {
          return (
            <Col xs="auto" className="mb-4">
              <MemberProfile tokenId={tokenId} />
            </Col>
          )
        })}
      </Row>
      {loading && (<div className="text-center"><Spinner /></div>)}
    </div>
  );
}

export default Members;