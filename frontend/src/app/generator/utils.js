import JSZip from "jszip";
import md5 from 'blueimp-md5';
import { saveAs } from 'file-saver';
import { MAX_IMAGE_DIMENSION, MAX_FAILURE_TOLERANCE } from "../constants";

import { createCanvas } from 'canvas';
if (!window.RareMints.ImageCache) {
  window.RareMints.ImageCache = {};
}

export function calculateRarity(group, assetByLayerId) {
  const rarities = group.layers.map(layer => {
    const assetId = assetByLayerId[layer.id];
    if (assetId) {
      const rarity = layer.assets.find(asset => asset.id === assetId).rarity;
      const totalSum = layer.assets.reduce((a, b) => {
        return a + b.rarity
      }, 0.);
      return rarity / totalSum;
    }
  }).filter(r => !!r);
  return rarities.reduce((a, b) => a * b, 1.)
}

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

const createThinProject = (project, selectedGroupId) => {
  const selectedGroup = project.groups.filter(group => group.layers.length > 0).find(g => g.id === selectedGroupId);
  if (!selectedGroup) {
    return project;
  }
  const layers = selectedGroup.layers.sort((a, b) => a.order - b.order).map(layer => {
    if (layer.assets.length === 0) {
      return layer;
    }
    return {...layer, assets: layer.assets.slice(0, 2)};
  })

  return {
    ...project,
    groups: [
      { ...selectedGroup, layers: layers }
    ],
  }
}

const groupIdWithMostAssets = (project) => {
  const assetCountByGroupId = {};
  project.groups.forEach((g) => {
    const assetCount = g.layers.map(l => l.assets.length).length;
    assetCountByGroupId[g.id] = assetCount;
  })
  const groupId = Object.keys(assetCountByGroupId).sort((a, b) => {
    return assetCountByGroupId[b] - assetCountByGroupId[a];
  })[0];
  return groupId;
}

export function createPreviewImages(project, setImages, n=1) {
  if (project?.groups && project.groups.length === 0) {
    return;
  }

  const selectedGroupId = groupIdWithMostAssets(project);
  const thinProject = createThinProject(project, selectedGroupId);

  let numByGroupId = {};
  numByGroupId[selectedGroupId] = n;
  const baseUrls = [];
  const generator = new Generator(thinProject, numByGroupId, {});
  generator.setCallbacks({drewOneImage: (newBaseUrl) => {
    baseUrls.push(newBaseUrl);
    setImages(baseUrls);
  }});
  generator.preview();
}

export function loadImage(src) {
  if (src in window.RareMints.ImageCache) {
    return new Promise((resolve, reject) => {
      resolve(window.RareMints.ImageCache[src]);
    })
  } else {
    return fetch(src, {
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Origin': window.location.hostname,
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    }).then(response => {
      return response.blob();
    }).then((blob) => {
      //const src = URL.createObjectURL(blob);
      return blobToBase64(blob);
    }).then((output) => {
      const image = new Image();
      image.src = output;
      window.RareMints.ImageCache[src] = image;
      return image;
    })
  }
}

const _sample = (probs) => {
  let sum = probs.reduce((a, b) => a + b, 0)
  if (sum <= 0) {
    console.error('probs must sum to a value greater than zero')
    probs = probs.map(p => 1);
    sum = probs.reduce((a, b) => a + b, 0)
  }
  const normalized = probs.map(prob => prob / sum)
  const sample = Math.random()
  let total = 0
  for (let i = 0; i < normalized.length; i++) {
    total += normalized[i]
    if (sample < total) return i
  }
}

export const dotSet = (obj, keyPath, value) => {
  const keys = keyPath.split('.');
  let currentObj = obj;
  keys.forEach((key, index) => {
    if (index >= keys.length - 1) return;
    if (!(key in currentObj)) {
      currentObj[key] = {};
    }
    currentObj = currentObj[key];
  });
  currentObj[keys[keys.length - 1]] = value;
  return obj;
}

export function buildGeneratedImage(baseUrl, selectedAssets) {
  return {
    attributes: selectedAssets.map(a => {
      return {
        trait_type: a.layer.name,
        value: a.asset.name,
      }
    }),
    dna: md5(JSON.stringify(selectedAssets.map(a => a.asset.id))),
    baseUrl: baseUrl,
  }
}

export function buildMetadataForERC721(name, description, imageUrl, generatedImage) {
  return {
    dna: generatedImage.dna,
    name: name,
    description: description,
    image: imageUrl,
    date: Date.now(),
    attributes: generatedImage.attributes,
    compiler: "raremints.club",
  }
}

export class Generator {
  constructor(project, numByGroupId, options) {
    this.consecutiveFailures = 0;
    this.project = project;
    this.imageByAssetId = {};
    this.numByGroupId = numByGroupId;
    this.options = options;
    this.generatedDnas = new Set();
    this.generations = [];
  }

  setCallbacks(callbacks) {
    this.callbacks = callbacks;
  }

  async generateImageForGroup(group) {
    const selectedAssets = [];
    const sortedLayers = group.layers.sort((a, b) => a.order - b.order);
    sortedLayers.forEach((layer) => {
      // Is layer selected?
      if (layer.rarity < Math.random()) {
        return;
      }
      if (layer.assets.length === 0) {
        return;
      }

      // Pick a random asset
      const selectedIndex = _sample(layer.assets.map(a => a.rarity));
      selectedAssets.push({
        group: group,
        layer: layer,
        asset: layer.assets[selectedIndex],
      });
    });

    const baseUrl = await this.combineAssetsToDrawImage(selectedAssets.map(a => a.asset));
    return buildGeneratedImage(baseUrl, selectedAssets);
  }

  createBlankCanvas(width, height) {
    return createCanvas(width, height);
  }

  combineAssetsToDrawImage(selectedAssets, isAsync = true) {
    const width = Math.min(MAX_IMAGE_DIMENSION, this.project.width);
    const height = Math.min(MAX_IMAGE_DIMENSION, this.project.height);
    const canvas = this.createBlankCanvas(width, height);
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    let baseUrl;
    if (selectedAssets.length === 1) {
      const asset = selectedAssets[0];
      const assetImage = this.imageByAssetId[asset.id];
      baseUrl = assetImage.src;
    } else {
      selectedAssets.forEach((asset) => {
        const assetImage = this.imageByAssetId[asset.id];
        try {
          context.drawImage(assetImage, 0, 0, canvas.width, canvas.height);
        }
        catch (err) {
          console.log(err)
          console.log(selectedAssets)
        }

      });
      baseUrl = canvas.toDataURL();
    }

    if (isAsync) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(baseUrl);
        }, 5);
      });
    } else {
      return baseUrl;
    }
  }

  downloadAssetsList(assets, callback) {
    let totalImages = assets.length;
    let downloadedImageCount = 0;
    let imageByAssetId = {}

    assets.forEach((asset) => {
      loadImage(asset.image_file).then((downloadedImage) => {
        imageByAssetId[asset.id] = downloadedImage;
        downloadedImageCount++
        if (downloadedImageCount >= totalImages) {
          this.imageByAssetId = imageByAssetId;
          callback(imageByAssetId);
        }
      })
    })
  }

  downloadAssets(callback) {
    let assetsToDownload = [];
    
    this.project.groups.forEach((group) => {
      group.layers.forEach((layer) => {
        layer.assets.forEach((asset) => {
          if (asset.image_file) {
            assetsToDownload.push(asset);
          }
        })
      })
    })
    this.downloadAssetsList(assetsToDownload, callback)
  }

  build(target='erc721', extra={}) {
    this.downloadAssets(function(imageByAssetId) {
      this.imageByAssetId = imageByAssetId;
      this.createGeneratedImages(target, extra, true);
    }.bind(this))
  }

  preview() {
    this.downloadAssets(function(imageByAssetId) {
      this.imageByAssetId = imageByAssetId;
      this.createGeneratedImages('erc721', {});
    }.bind(this))
  }

  async createGeneratedImages(target, extra, exportGenerations=false) {
    for (const [groupId, n] of Object.entries(this.numByGroupId)) {
      const group = this.project.groups.find(g => g.id === groupId);

      let index = 0;
      while (index < n) {
        const generatedImage = await this.generateImageForGroup(group);
        // Generate batches
        
        if (!this.generatedDnas.has(generatedImage.dna)) {
          this.consecutiveFailures = 0;
          this.generatedDnas.add(generatedImage.dna)
          this.callbacks.drewOneImage(generatedImage.baseUrl);
          let metadata;
          let metadataFilename;
          if (target === 'erc721') {
            metadata = buildMetadataForERC721(
              `${this.project.name} #${index}`,
              this.project.description,
              `REPLACE-THIS-WITH-YOUR-URL/${index}.png`,
              generatedImage,
            );
            metadataFilename = `${index}`;
          } else {
            metadata = this.buildMetadataForCandyMachine(index, generatedImage, extra);
            metadataFilename = `${index}.json`;
          }
          // This generations needs to be cleared
          this.generations.push({
            metadata: metadata,
            metadataFilename: metadataFilename,
            imageFilename: `${index}.png`,
            baseUrl: generatedImage.baseUrl.split(',')[1]
          });
          index++;
          if (
            exportGenerations &&
            this.options.generateInBatches &&
            index > 0 &&
            (index % this.options.generateInBatches === 0)
          ) {
            this.createZip(target);
            this.generations = [];
          }
        } else {
          this.consecutiveFailures += 1;
          if (this.consecutiveFailures > MAX_FAILURE_TOLERANCE) {
            console.log(`Failed ${this.project.name}!`)
            return;
          }
        }
      }

      if (exportGenerations) {
        this.createZip(target);
      }
    }
  }

  async createZip(target) {
    if (this.generations.length === 0) {
      return;
    }
    let imagesFolder;
    let metadataFolder;
    if (target === 'erc721') {
      imagesFolder = "images";
      metadataFolder = "metadata";
    } else {
      imagesFolder = "assets";
      metadataFolder = "assets";
    }
    const zip = new JSZip();

    this.generations.forEach((g) => {
      zip.folder(imagesFolder).file(g.imageFilename, g.baseUrl, {base64: true});
      zip.folder(metadataFolder).file(g.metadataFilename, JSON.stringify(g.metadata, null, 2));
    });

    this.callbacks.complete();
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${this.project.name.replace('-', '')}.zip`);
    }.bind(this));

  }

  buildMetadataForCandyMachine(index, generatedImage, extra={}) {
    return {
      name: `${this.project.name} #${index}`,
      symbol: "NFT",
      description: this.project.description,
      seller_fee_basis_points: extra.sellerFeeBasisPoints || 500,
      image: `${index}.png`,
      animation_url: "",
      external_url: "",
      attributes: generatedImage.attributes,
      collection: {
        name: this.project.name,
        family: this.project.name,
      },
      properties: {
        files: [
          {
            uri: `${index}.png`,
            type: "image/png"
          }
        ],
        category: "image",
        creators: [
          {
            address: extra.walletAddress || "YOUR_SOLANA_PUBLIC_ADDRESS_HERE",
            share: 100
          }
        ]
      }
    }
  }
}
