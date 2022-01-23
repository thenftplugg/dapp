import React from "react";
import { Image } from 'react-bootstrap';

const ProfileImage = ({src}) => {
  return (
    <Image style={{borderRadius: "100px"}} height="50" src={src} />
  );
}

export default ProfileImage;