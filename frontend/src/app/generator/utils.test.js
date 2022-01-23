import { Generator, dotSet } from './utils';

let project = {
  name: "Project",
  groups: [{
    id: "g1",
    name: "Group 1",
    layers: [{
      id: "l1",
      name: "Layer 1",
      assets: [{
        id: "a1",
        name: "Asset 1",
        image_file: "https://www.dinobros.xyz/nft/5/background.png"
      }, {
        id: "a1",
        name: "Asset 2",
        image_file: "https://www.dinobros.xyz/nft/1/background.png"
      }]
    }]
  }],
}

class MockCanvas {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  getContext() {
    return new MockContext();
  }
}

class MockContext {
  drawImage(){}
}

it('can download assets', () => {
  const g = new Generator(project, { 'g1': 100 })
  g.downloadAssets((imageByGroupIdLayerIdAssetId) => {
    console.log(imageByGroupIdLayerIdAssetId);
  })
})

it('can combineAssetsToDrawImage', () => {
  const g = new Generator(project, { 'g1': 100 });
  dotSet(g.imageByGroupIdLayerIdAssetId, 'g1.l1.a1', new Blob());
  dotSet(g.imageByGroupIdLayerIdAssetId, 'g2.l2.a2', new Blob());
  g.createBlankCanvas = () => {
    return new MockCanvas()
  }
  const img = g.combineAssetsToDrawImage([
    {
      groupId: 'g1',
      layerId: 'l1',
      assetId: 'a1',
      asset: {name: 'asset', id: 'a1'},
    },
    {
      groupId: 'g1',
      layerId: 'l1',
      assetId: 'a2',
      asset: {name: 'asset-2', id: 'a2'},
    },
  ]);
})
/*
it('can create zip', () => {
  const g = new Generator(project, { 'g-123': 100 });
  g.createZip();
})
*/

it('dotSave works', () => {
  let obj = {};
  dotSet(obj, 'a', 'b');
  expect(obj['a']).toEqual('b');

  obj = {};
  dotSet(obj, 'a.b.c', 'd');
  expect(obj['a']['b']['c']).toEqual('d');
});
