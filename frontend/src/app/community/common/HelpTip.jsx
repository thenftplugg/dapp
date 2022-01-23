import React from "react";
import { Tooltip, OverlayTrigger} from "react-bootstrap";

const HelpTip = ({text, placement="top", children}) => {
  const toolTip = (
    <Tooltip id={text + "tooltip"}>
      {text}
    </Tooltip>
  );

  

 return ( 
   <OverlayTrigger
      placement={placement}
      delay={{ show: 250, hide: 400 }}
      overlay={toolTip}
    >
      {children}
    </OverlayTrigger>
 )};

export default HelpTip;