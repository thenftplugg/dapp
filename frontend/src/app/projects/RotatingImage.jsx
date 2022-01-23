import React, { useEffect, useState, useRef } from 'react';
import { createPreviewImages } from '../generator/utils';


export default function RotatingImage({project, rotating, style={}}) {
  const [baseUrls, _setBaseUrls] = useState([]);
  const [currentBaseUrlIndex, setCurrentBaseUrlIndex] = useState(0);

  const savedInterval = useRef(null);
  const currentBaseUrlIndexRef = useRef(currentBaseUrlIndex);
  const currentBaseUrls = useRef(baseUrls);
  const setBaseUrls = (newBaseUrls) => {
    _setBaseUrls(newBaseUrls)
    currentBaseUrls.current = newBaseUrls;
  }

  useEffect(() => {
    createPreviewImages(project, setBaseUrls, 10);
  }, [])

  useEffect(() => {
    if (rotating) {
      const id = setInterval(() => {
        currentBaseUrlIndexRef.current = currentBaseUrlIndexRef.current + 1
        setCurrentBaseUrlIndex((currentBaseUrlIndexRef.current) % currentBaseUrls.current.length)
      }, 100)
      savedInterval.current = id;
    } else {
      if (savedInterval.current) {
        clearInterval(savedInterval.current)
      }
    }
  }, [rotating])
  
  return (
    <img src={baseUrls.length > 0 && baseUrls[currentBaseUrlIndex]} style={style} />
  )
}


