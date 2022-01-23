import React, { useState } from 'react';


const SimplePills = ({pills, onChange, selected }) => {
  return (
    <div>
      {pills.map(pill => {
        return (
          <span className={`pointer p-2 rounded mb-4 mr-5 ${pill[0] === selected ? 'h2' : 'h4'}`} onClick={() => {
            onChange(pill[0])
          }}>{pill[1]}</span>
        );
      })}
    </div>
  );
}

export default SimplePills;