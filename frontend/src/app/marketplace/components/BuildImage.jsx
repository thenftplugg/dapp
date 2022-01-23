import React, { useState, useEffect, useContext } from 'react';
import { Button, Row, Col, Container } from 'react-bootstrap'
import Preview from './Preview';
import LayerScroll from './LayerScroll';
import { buildSpecifiedImage } from '../../editor/utils';
import { calculateRarity } from '../../generator/utils';
import BuildABearContext from '../context/BuildABearContext';
import HoverImage from './HoverImage';
import { useMediaQuery } from 'react-responsive';

const BuildImage = () => {
  const {
    project,
    currentStep,
    setCurrentStep,
    composerAssetByLayerId,
    setComposerAssetByLayerId,
    baseUrl,
    setBaseUrl,
    selectedGroupIndex,
    setSelectedGroupIndex,
  } = useContext(BuildABearContext)
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [rarityCalculation, setRarityCalculation] = useState(0.);
  const groups = project.groups.filter(g => g.layers.length)

  useEffect(() => {
      if (groups.length === 1) setSelectedGroupIndex(0);
      setSelectedLayerIndex(0)
      setComposerAssetByLayerId({})
  }, [])

  const selectedGroup = groups[selectedGroupIndex % groups.length];
  const selectedLayer = selectedGroup && selectedGroup.layers[selectedLayerIndex]
  const hasAssetsForPreview = Object.keys(composerAssetByLayerId).length > 0;
  const isComplete = Object.keys(composerAssetByLayerId).length === selectedGroup.layers.length;

  const activeAssets = baseUrl && Object.keys(composerAssetByLayerId).map(x =>
      selectedGroup.layers.find(l => l.id === x)?.assets?.find(a => a.id == composerAssetByLayerId[x])?.image_file
  );

  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' });

  const layerRefs = selectedGroup?.layers?.reduce((acc, value, idx) => {
    acc[idx] = React.createRef();
    return acc
  }, {});

  const autoScrollToNextLayer = (idx) => (
    layerRefs[idx + 1]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: "start",
    })
  );

  useEffect(() => {
    if (selectedGroup) {
      const assets = selectedGroup.layers.map(layer => {
        const assetId = composerAssetByLayerId[layer.id];
        if (assetId) {
          return layer.assets.find(asset => asset.id === assetId);
        }
      }).filter(a => !!a);

      buildSpecifiedImage(project, assets, (newBaseUrl) => {
        setBaseUrl(newBaseUrl);
      });
      const rarity = calculateRarity(selectedGroup, composerAssetByLayerId);
      setRarityCalculation(rarity);
    }
  }, [selectedGroup, composerAssetByLayerId]);
  return (
    <div>
      <div className="text-center display-2 pt-5 mb-3">
        <i className="mdi mdi-chevron-left mr-4 pointer" onClick={() => {
          setComposerAssetByLayerId({})
          setBaseUrl(null)
          setSelectedLayerIndex(0)
          if (!selectedGroupIndex) {
            setSelectedGroupIndex(groups.length - 1);
          } else {
            setSelectedGroupIndex(selectedGroupIndex - 1);
          }
        }}/>
        {groups[selectedGroupIndex % groups.length].name}
        <i className="mdi mdi-chevron-right ml-4 pointer" onClick={() => {
          setComposerAssetByLayerId({})
          setBaseUrl(null)
          setSelectedLayerIndex(0)
          if (selectedGroupIndex == groups.length - 1) {
            setSelectedGroupIndex(0);
          } else {
            setSelectedGroupIndex(selectedGroupIndex + 1);
          }
        }} />
      </div>
      {selectedGroup && 
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} md={6} sm={9} xs={10} className="order-lg-last order-first">
              <div className="text-center">
                {!hasAssetsForPreview && (
                  <div className="mt-5 text-muted">
                    Select an image to get started
                  </div>
                )}
                {baseUrl && 
                  <HoverImage images={activeAssets} imageRatio={project.height / project.width} />
                }
                {hasAssetsForPreview &&
                  <div className="my-4">
                    <div>Rarity: {(rarityCalculation * 100.).toFixed(2)}%</div>
                    <Button variant={"info"} disabled={!isComplete} size="lg" onClick={() => setCurrentStep(currentStep + 1)}>
                      Name your creation <i className="mdi mdi-arrow-right"></i>
                    </Button>
                  </div>
                }
              </div>
            </Col>
            <Col lg={7} md={12}>
              {!isDesktop ?
                <div>
                  <div>
                    <LayerScroll
                      layers={selectedGroup.layers}
                      selectedLayerIndex={selectedLayerIndex}
                      setSelectedLayerIndex={setSelectedLayerIndex}
                    />
                  </div>
                  <div className="text-center">
                    {selectedLayer.assets.map(asset => {
                      const newComposerAssetByLayerId = {...composerAssetByLayerId};
                      newComposerAssetByLayerId[selectedLayer.id] = asset.id
                      return (
                        <Preview
                          project={project}
                          seletedGroup={selectedGroup}
                          composerAssetByLayerId={newComposerAssetByLayerId}
                          imageProps={{
                            className: `pointer p-2 m-1 ${composerAssetByLayerId[selectedLayer.id] === asset.id && "border-light border rounded"}`,
                            onClick: () => {
                              setComposerAssetByLayerId(newComposerAssetByLayerId);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </div> :
                <div className="overflow-auto" style={{maxHeight: "100vh"}}>
                  {selectedGroup.layers.map((layer, index) => (
                    <div className="text-center px-4" key={layer.id} ref={layerRefs[index]}>
                      <h5>{layer.name}</h5>
                      <hr/>
                      <div className="d-flex flex-wrap">
                      {layer.assets.map(asset => {
                        const newComposerAssetByLayerId = {...composerAssetByLayerId};
                        newComposerAssetByLayerId[layer.id] = asset.id
                        const images = Object.keys(newComposerAssetByLayerId).map(x =>
                          selectedGroup.layers.find(l => l.id === x)?.assets?.find(a => a.id == newComposerAssetByLayerId[x])?.image_file
                        );
                        return (
                          <div className="board " style={{ "--width": `150px`, "--height": `${150 * project.height / project.width}px`}}>
                            {images.map((image, idx) =>
                              <img
                                key={idx}
                                src={image}
                                className={`pointer p-2 m-1 ${composerAssetByLayerId[layer.id] === asset.id && "border-light border rounded"}`}
                                onClick={() => {
                                  setComposerAssetByLayerId(newComposerAssetByLayerId);
                                  autoScrollToNextLayer(index)
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  ))}
                </div>
              }
            </Col>
          </Row>
        </Container>
      }
    </div>
  )
}

export default BuildImage;
