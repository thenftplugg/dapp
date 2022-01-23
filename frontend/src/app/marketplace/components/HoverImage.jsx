import React from 'react';

const IMAGE_SIZE = 300;

const HoverImage = ({images, imageRatio}) => (
  <div style={{textAlign: "-webkit-center"}} className="hover-wrapper">
    <div className="hover-board" style={{ "--width": `${IMAGE_SIZE}px`, "--height": `${IMAGE_SIZE * imageRatio}px`}}>
      {images.map((image, idx) => 
        <img
          key={idx}
          src={image}
          style={{"--transform": `translate(${idx * 20}px, -${idx * 20}px)`}}
        />
        )}
    </div>
  </div>
)

export default HoverImage;
