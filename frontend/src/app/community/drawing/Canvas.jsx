import React, { useRef, useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { rgbToHex, invertColor, canvasArrow } from './utils';

const Canvas = ({pixels, selectedColor, setUserPixel, highlightPixel}) => {
  const canvasRef = useRef(null);
  const maxCanvasDim = () => Math.min(window.innerHeight, window.innerWidth, 600) - 50
  const [canvasLength, setCanvasLength] = useState(maxCanvasDim());

  const drawHighlightPixel = (ctx, pixel) => {
    const fromX = (pixel.x * canvasLength) / 100 + (canvasLength / 100 / 2);
    const fromY = (pixel.y * canvasLength) / 100;
    canvasArrow(ctx, invertColor(rgbToHex(pixel.color)), fromX, fromY - 30, fromX, fromY - 8);
  }

  const drawPixel = (ctx, pixel) => {
    ctx.fillStyle = pixel.color
    ctx.fillRect(
      (pixel.x * canvasLength) / 100,
      (pixel.y * canvasLength) / 100,
      canvasLength / 100,
      canvasLength / 100,
    )
  }

  const setCanvas = () => {
    const canvas = canvasRef.current
    const dim = maxCanvasDim();
    canvas.width = dim;
    canvas.height = dim;

    const context = canvas.getContext('2d')
    context.fillStyle = "white";
    context.fillRect(0, 0, dim, dim);
    if (!pixels['data']) {
      return
    }
    const flattenedPixels = []
    for (const x in pixels['data']) {
      for (const y in pixels['data'][x]) {
        flattenedPixels.push({
          x: x,
          y: y,
          color: rgbToHex(pixels['data'][x][y]),
        })
      }
    }
    
    flattenedPixels.map(pixel => {
      if (pixel.color) drawPixel(context, pixel)
    }) 
    if (highlightPixel) {
      drawHighlightPixel(context, highlightPixel);
    }
  }

  const cursor = () => {
    var canvas = document.createElement("canvas");
    canvas.width = 6;
    canvas.height = 6;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = selectedColor;
    ctx.fillRect(0, 0, 6, 6);
    var dataURL = canvas.toDataURL('image/png')
    document.getElementById('canvas').style.cursor = 'url('+dataURL+') -3 -3, auto';
  };

  useEffect(setCanvas, [highlightPixel, canvasLength, pixels]);
  useEffect(cursor, [selectedColor]);

  useEffect(() => {
    window.onresize = function() {
      setCanvasLength(maxCanvasDim())
    };
  }, []);

  const handleClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) * 100 / canvasLength
    const y = (event.clientY - rect.top) * 100 / canvasLength
    const newPixel = { x: Math.floor(x) , y: Math.floor(y), color: selectedColor };
    setUserPixel(newPixel);
  }
  const imgHeight = canvasRef?.current?.height;
  return (
    <div id="canvas-image"
      style={{
        height: `${parseInt(imgHeight * 1.40, 10)}px`,
      }}
    >
      {imgHeight && (
        <Image
          style={{
            height: `${parseInt(imgHeight * 1.40, 10)}px`,
            top: `-${parseInt(imgHeight * 1.40, 10) * 0.06}px`,
            left: `-${parseInt(imgHeight * 1.40, 10) * 0.06}px`,
          }}
          src="/easel.png" />
      )}
      <canvas ref={canvasRef} id="canvas" onClick={(e) => handleClick(e.nativeEvent)} />
    </div>
  );
}

export default Canvas;
