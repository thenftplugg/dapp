import React from 'react';
import Slider from "react-slick";

const CategorySlider = ({title, marketplaces}) => {
  const settings = {
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1
  };
  return (
    <div>
      {title && <h4>{title}</h4>}
      <Slider {...settings}>
        {marketplaces.map(marketplace => 
          <div>
            <div className="px-2 slide_wrapper" onClick={() => window.location.href = "/m/" + marketplace.id}>
              <div className="ml-2 pb-2 h6">{marketplace.project.name}</div>
              <div className="slide_preview" style={{"--nft-image": `url(${marketplace.project.profile_image_url})` }}>
              </div>
            </div>
          </div>
        )}
      </Slider>
    </div>
  )
}

export default CategorySlider;
