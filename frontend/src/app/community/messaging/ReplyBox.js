import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, FormControl, Card, Button, InputGroup } from 'react-bootstrap';
import { buildRoute } from '../../auth/client/routes';
import CommunityContext from '../context';
import TimeAgo from 'javascript-time-ago'
import ProfileImage from '../common/ProfileImage';
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en);


const ReplyBox = ({messageId}) => {
  const { chosenToken, imageCache } = useContext(CommunityContext);
  const imageUrl = imageCache.get(chosenToken.token_id);
  const [message, setMessage] = useState('');
  const submit = async () => {
    const response = await axios.post(buildRoute('/replies/'), {
      token_identifier: chosenToken.token_id,
      message: messageId,
      body: message,
    });
    return response.data
  }

  return (
    <Row>
      <Col xs="auto">
        <ProfileImage src={imageUrl} />
      </Col>
      <Col>
        <InputGroup>
          <FormControl
            autoFocus={true}
            className="reply-message"
            size="lg"
            rows="2"
            as="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder=""
          />
        </InputGroup>
        <div className="d-flex mt-3 text-right" style={{ justifyContent: "space-between" }}>
          <i className="mdi mdi-file-image text-muted h3"></i>
          <Button variant="primary" onClick={submit}>
            Post
          </Button>
        </div>
      </Col>
    </Row>
  )
}

export default ReplyBox;