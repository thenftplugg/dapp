import { Generator } from '../../generator/utils';

export const buildSpecifiedImage = (project, selectedAssets, callback) => {
  const generator = new Generator(project, null, null);
  generator.downloadAssetsList(selectedAssets, () => {
    const baseUrl = generator.combineAssetsToDrawImage(selectedAssets, false);
    callback(baseUrl);
  })
}

export const rarityTotal = (_assets) => {
  const rarities = _assets
    .map(x => x.rarity);
  
  return rarities.length > 0 ? rarities.reduce((previousValue, currentValue) => previousValue + currentValue) : 0;
}

const updateRarities = (_assets, asset, rarity) => {
  let rarityLeftOver = 100 - rarityTotal(_assets.filter(x => x.locked)) - rarity;

  if (rarityLeftOver < 0) return _assets;
  const unlockedAssets = _assets.filter(x => !x.locked)
  const unlockedLength = unlockedAssets.length - 1;
  const unlockedAssetIds = unlockedAssets.map(x => x.id);
  const equalRarity = rarityLeftOver / unlockedLength

  if (Math.max(rarityLeftOver, 0) >= 0) {
    return _assets.map(a => {
      if (a.id === asset.id) return ({...a, rarity: rarity})
      if (unlockedAssetIds.includes(a.id)) {
        return ({...a, rarity: equalRarity})
      } else {
        return a
      }
    })
  } else {
    return _assets;
  }
}


export default updateRarities;