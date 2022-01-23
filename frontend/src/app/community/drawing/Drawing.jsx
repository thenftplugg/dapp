import React, { useState, useEffect, useContext } from 'react';
import CommunityContext from '../context';
import axios from 'axios';
import { buildRoute } from '../../auth/client/routes';
import { Row, Col, Image } from 'react-bootstrap';
import Canvas from './Canvas';
import Swal from 'sweetalert2';
import ToolBar from './ToolBar';
import PixelHistory from './PixelHistory';
import { hexToRgb } from './utils';


const Drawing = ({}) => {
  const { community, chosenToken } = useContext(CommunityContext);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [pixels, setPixels] = useState(community.communal_canvas.image);
  const [pixelHistory, setPixelHistory] = useState({});
  const [highlightPixel, setHighlightPixel] = useState(null);
  useEffect(() => {
    axios
      .get(buildRoute(`/pixels?communal_canvas=${community.communal_canvas.id}`))
      .then((response) => {
        setPixelHistory(response.data)
      })
  }, [])

  const errorPopup = (message) => (
    Swal.fire({
      title: "Error!",
      text:  message,
      icon: "error",
      confirmButtonText: "ok"
    })
  );

  const setUserPixel = (newPixel) => {
    const rgb = hexToRgb(newPixel.color);
    axios
      .post(
        buildRoute('/pixels/'),
        {
          token_identifier: chosenToken.token_id,
          communal_canvas: community.communal_canvas.id,
          x: newPixel.x,
          y: newPixel.y,
          color: rgb,
        },
      )
      .then(response => {
        const confirmedPixel = response.data;
        const newPixels = {...pixels};
        if (!newPixels['data']) {
          newPixels['data'] = {}
        }
        if (!newPixels['data'][confirmedPixel.x]) {
          newPixels['data'][confirmedPixel.x] = {}
        }
        newPixels['data'][confirmedPixel.x][confirmedPixel.y] = confirmedPixel.color;
        setPixelHistory({...pixelHistory, results: [confirmedPixel, ...pixelHistory.results]})
        setPixels(newPixels);
      })
      .catch(error => {
        console.log(error)
        if (error.response && error.response.data.error) {
          errorPopup(error.response.data.error)
        } else {
          errorPopup("Something went wrong. Try again!")
        }
      });
  }

  return <Row className="justify-content-md-center">
    <Col md="auto" className="d-none d-lg-block m-0 mr-lg-5">
      <PixelHistory setHighlightPixel={setHighlightPixel} pixelHistory={pixelHistory} />
    </Col>
    <Col xs="auto mx-auto mx-lg-0">
      <Canvas
        highlightPixel={highlightPixel}
        pixels={pixels}
        selectedColor={selectedColor}
        setUserPixel={setUserPixel}
      />
    </Col>
    <Col xs="auto" className="ml-0 ml-lg-5 mt-4 mb-lg-0">
      <ToolBar selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
    </Col>
  </Row>
}

export default Drawing;
