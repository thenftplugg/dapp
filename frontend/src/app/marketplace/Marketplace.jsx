import React from 'react';
import BuildABear from './BuildABear';


const Marketplace = (props) => {
  return (
    <div>
      <BuildABear marketplaceSlug={props.match.params.marketplaceSlug} />
    </div>
  )
}

export default Marketplace;
