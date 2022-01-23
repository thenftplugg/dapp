import React, { useEffect, useState } from 'react';
import { calculateRarity } from '../../generator/utils';
import { buildSpecifiedImage } from '../utils';

const IMAGE_SIZE = 400;

const DownloadBase64Image = ({baseUrl}) => {
  if (!baseUrl) {
    return null;
  }
  const extension = baseUrl.substring("data:image/".length, baseUrl.indexOf(";base64"));
  return (
    <a className="btn btn-primary" href={baseUrl} download={`image.${extension}`}>Download Image</a>
  );
}

const Creator = ({
  project,
  selectedGroupId,
  composerAssetByLayerId,
}) => {
  const [baseUrl, setBaseUrl] = useState(null)
  const [rarityCalculation, setRarityCalculation] = useState(0.);
  useEffect(() => {
    const currentGroup = project.groups.find(g => g.id === selectedGroupId);
    if (!currentGroup) {
      return;
    }
    const assets = currentGroup.layers.map(layer => {
      const assetId = composerAssetByLayerId[layer.id];
      if (assetId) {
        return layer.assets.find(asset => asset.id === assetId);
      }
    }).filter(a => !!a);

    buildSpecifiedImage(project, assets, (newBaseUrl) => {
      setBaseUrl(newBaseUrl);
    });
    const rarity = calculateRarity(currentGroup, composerAssetByLayerId);
    setRarityCalculation(rarity);
  }, [composerAssetByLayerId, selectedGroupId]);
  return (
    <div className="text-center">
      {Object.keys(composerAssetByLayerId).length === 0 && (
        <div className="mt-5 text-muted">
          Pin an asset to get started
        </div>
      )}
      <img src={baseUrl} width={IMAGE_SIZE} height={IMAGE_SIZE * project.height / project.width} />
      {Object.keys(composerAssetByLayerId).length > 0 && (
        <>
          <div className="my-4">
            Rarity: {(rarityCalculation * 100.).toFixed(2)}%
          </div>
          <DownloadBase64Image baseUrl={baseUrl} />
        </>
      )}
    </div>
  )
}

export default Creator;
