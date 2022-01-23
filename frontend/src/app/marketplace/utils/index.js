import { buildGeneratedImage, buildMetadataForERC721 } from '../../generator/utils';

export const buildSelectedAssets = ({selectedGroup, composerAssetByLayerId}) => {
  return Object.keys(composerAssetByLayerId).map(layerId => {
    const layer = selectedGroup.layers.find(layer => layer.id === layerId);
    const asset = layer.assets.find(asset => asset.id === composerAssetByLayerId[layerId])
    return {asset: asset, layer: layer}
  })
}

export const buildMetadata = (project, selectedAssets) => {
  const generatedImage = buildGeneratedImage('', selectedAssets);
  const metadata = buildMetadataForERC721(project.name, project.description, 'REPLACE-THIS', generatedImage)
  return metadata;
}

export function urltoFile(url, filename, mimeType){
  return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename,{type:mimeType});})
  );
}