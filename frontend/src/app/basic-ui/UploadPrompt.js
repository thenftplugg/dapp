import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const UploadPrompt = ({active=false, onClick}) => {
  if (!active) return null;
  return (
    <div style={{zIndex: "10000", position: "fixed", top: "0", left: "0", backgroundColor: "white", height: "100%", width: "100%", opacity: "0.5"}}>
      <div style={{zIndex: "10001", position: "fixed", top: "50%", height: "100%", width: "100%", opacity: "1", color: 'black'}} className="display-1 text-center">Drop File Anywhere</div>
    </div>
  )
}

export default UploadPrompt;