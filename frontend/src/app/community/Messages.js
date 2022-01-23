import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, FormControl, Card, Button, InputGroup } from 'react-bootstrap';
import { buildRoute } from '../auth/client/routes';
import CommunityContext from './context';
import TimeAgo from 'javascript-time-ago'
import ProfileImage from './common/ProfileImage';
import en from 'javascript-time-ago/locale/en.json'
import MessageRow from './messaging/MessageRow'

TimeAgo.addDefaultLocale(en);


const MessageInput = ({onSubmit}) => {
  const { chosenToken, imageCache } = useContext(CommunityContext);
  const imageUrl = imageCache.get(chosenToken.token_id);
  const [newMessage, setNewMessage] = useState('');

  const submit = () => {
    onSubmit(newMessage);
    setNewMessage('');
  };

  return (
    <Card className="p-4">
      <Row>
        <Col xs="auto">
          <ProfileImage src={imageUrl} />
        </Col>
        <Col>
          <InputGroup>
            <FormControl
              id="post-message"
              size="lg"
              rows="2"
              as="textarea"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Whats going on?"
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
    </Card>
  )
}

const Messages = () => {
  const { chosenToken, community } = useContext(CommunityContext);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get(buildRoute(`/messages?community=${community.id}`)).then((response) => {
      setMessages(response.data);
    });
  }, []);
  return (
    <div className="p-4">
      <MessageInput
        onSubmit={(newMessage) => {
          axios.post(buildRoute('/messages/'), {
            token_identifier: chosenToken.token_id,
            community: community.id,
            body: newMessage,
          }).then((response) => {
            setMessages([response.data, ...messages]);
          })
        }} />

      {messages.map((message) => <MessageRow message={message} />)}
    </div>
  );
}

export default Messages;