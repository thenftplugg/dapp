import React, { useContext, useEffect } from "react";
import { Card } from 'react-bootstrap'
import { rgbToHex } from "./utils";
import CommunityContext from "../context";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ProfileImage from "../common/ProfileImage";

TimeAgo.addDefaultLocale(en);

const PixelRow = ({pixel, setHighlightPixel}) => {
  const { imageCache, setImageCache } = useContext(CommunityContext);
  const timeAgo = new TimeAgo('en-US');
  const color = rgbToHex(pixel.color)
  useEffect(() => {
    downloadProfileImage();
  }, [])

  const downloadProfileImage = async () => {
    const newImageCache = await imageCache.addToCache([pixel.token_identifier]);
    setImageCache(newImageCache);
  }
  return (
    <div
      style={{borderLeft: `10px solid ${color}`}}
      className="pointer animate__animated animate__heartBeat px-4 py-4 update-row"
      onMouseOut={() => {
        setHighlightPixel(null);
      }}
      onMouseOver={() => {
        setHighlightPixel(pixel)
      }}>
      <div className="mb-4"><ProfileImage src={imageCache.get(pixel.token_identifier)} /> #{pixel.token_identifier}</div>
      <small><i>{timeAgo.format(new Date(pixel.created))}</i></small>
    </div>
  );
}
const PixelHistory = ({pixelHistory, setHighlightPixel}) => {
  const canvasHeight = document.getElementById("canvas")?.clientHeight || 0;

  return (
    <div id="pixel-updates" style={{height: canvasHeight}}>
      <h4>Recent updates</h4>
      <Card>
        {(pixelHistory.results || []).map((pixel) => {
          return (
            <PixelRow pixel={pixel} setHighlightPixel={setHighlightPixel} />
          )
        })}
      </Card>
    </div>
  );
}

export default PixelHistory;