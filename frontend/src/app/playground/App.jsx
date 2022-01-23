import React from 'react';
import GIF from 'gif.js';
import { useEffect, useState } from 'react';
import { blobToBase64, loadImage } from '../generator/utils';

export default function Playground() {
  const [img, setImg] = useState(null);
  useEffect(() => {
    loadImage("https://i.imgur.com/5zpU7y3.jpeg").then((image1) => {
      loadImage("https://i.imgur.com/9l01AQ2.png").then((image2) => {
        //console.log(image1);
        //console.log(image2);
        var gif = new GIF({
          workers: 2,
          quality: 10
        });

        gif.addFrame(image1);
        gif.addFrame(image2);
        gif.on('finished', function(blob) {
          blobToBase64(blob).then((base64) => {
            setImg(base64)
          });
        });

        gif.render();
      })
    })
  }, [])

  return (
    <div>
      This is the playground!
      <img src={img} />
    </div>
  );
}