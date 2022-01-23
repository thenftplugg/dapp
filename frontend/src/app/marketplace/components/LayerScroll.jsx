import React from 'react';

const LayerScroll = ({layers, selectedLayerIndex, setSelectedLayerIndex, setActiveLayer}) => {

  const firstLayerOption = (layerIndex) => {
    const index = layerIndex - 1;
    return layers[index] ? index : layers.length - 1
  };

  const lastLayerOption = (layerIndex) => {
    const index = layerIndex + 1;
    return layers[index] ? index : 0
  };

  return layers.length > 3 ? (
    <div className="text-center d-flex justify-content-center my-3">
      <i className="mdi mdi-chevron-left mr-2 pointer" onClick={() => {
        setSelectedLayerIndex(firstLayerOption(selectedLayerIndex));
      }}/>
      <div style={{width: "75vh"}}>
        <span className="pointer scroll-text-first mx-3" onClick={() => {
          setSelectedLayerIndex(firstLayerOption(selectedLayerIndex))
        }}>
          {layers[firstLayerOption(selectedLayerIndex)].name}
        </span>
        <span className="pointer scroll-text mx-3" onClick={() => setSelectedLayerIndex(selectedLayerIndex)}>
          {layers[selectedLayerIndex].name}
        </span>
        <span className="pointer scroll-text-last mx-3" onClick={() => {
          setSelectedLayerIndex(lastLayerOption(selectedLayerIndex))
        }}>
          {layers[lastLayerOption(selectedLayerIndex)].name}
        </span>
      </div>
      <i className="mdi mdi-chevron-right ml-2 pointer" onClick={() => {
        setSelectedLayerIndex(lastLayerOption(selectedLayerIndex));
      }} />
    </div> 
  ) : (
    <div className="text-center my-3">
      {layers.map((layer, idx) => (
        <span key={idx} className="pointer scroll-text mx-3" onClick={() => setSelectedLayerIndex(idx)}>
          {layer.name}
        </span>
      ))}
    </div>
  )
}

export default LayerScroll;
