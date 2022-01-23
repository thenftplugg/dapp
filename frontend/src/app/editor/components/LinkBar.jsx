import React, { useContext, useState } from 'react';
import { Row, Col } from 'react-bootstrap';


export default function LinkBar({links, icons=false}) {
  const createLink = (link, name, icon) => <Col xs="auto"><a target="_blank" href={link}>{icons ? <i className={`mdi mdi-${icon}`}></i> : name }</a></Col>;

  return (
    <Row>
      {links.website && createLink(`https://${links.website}`, "Official", "web")}
      {links.opensea && createLink(`https://opensea.io/collection/${links.opensea}`, "OpenSea", "sailing")}
      {links.discord && createLink(`https://www.discord.com/invite/${links.discord}`, "Discord", "discord")}
      {links.twitter && createLink(`https://www.twitter.com/${links.twitter}`, "Twitter", "twitter")}
      {links.etherscan && createLink(`https://www.etherscan.io/address/${links.etherscan}`, "Etherscan", "ethereum")}
    </Row>
  );
}
