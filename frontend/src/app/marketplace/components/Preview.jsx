import React, { useEffect, useState } from 'react';
import { buildSpecifiedImage } from '../../editor/utils';

const IMAGE_SIZE = 150

const Preview = ({
  project,
  seletedGroup,
  composerAssetByLayerId,
  imageProps={size: 400},
}) => {
  const [baseUrl, setBaseUrl] = useState(null)

  useEffect(() => {
    const assets = seletedGroup.layers.map(layer => {
      const assetId = composerAssetByLayerId[layer.id];
      if (assetId) {
        return layer.assets.find(asset => asset.id === assetId);
      }
    }).filter(a => !!a);

    buildSpecifiedImage(project, assets, (newBaseUrl) => {
      setBaseUrl(newBaseUrl);
    });
  }, [composerAssetByLayerId]);

  return (
    <img src={baseUrl} width={IMAGE_SIZE} height={IMAGE_SIZE * project.height / project.width} {...imageProps} />
  )
}

export default Preview;
