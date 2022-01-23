import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import CommunityContext from '../context';
import TimeAgo from 'javascript-time-ago'
import ProfileImage from '../common/ProfileImage';
import en from 'javascript-time-ago/locale/en.json'
import ReplyBox from './ReplyBox';

TimeAgo.addDefaultLocale(en);

const MessageRow = ({message}) => {
  const { imageCache, setImageCache } = useContext(CommunityContext);
  const timeAgo = new TimeAgo('en-US');
  useEffect(() => {
    downloadProfileImage();
  }, [])

  const downloadProfileImage = async () => {
    const newImageCache = await imageCache.addToCache([message.token_identifier]);
    setImageCache(newImageCache);
  }
  const [replying, setReplying] = useState(false);
  return (
    <Card key={message.id} className="my-3 p-4">
      <Row>
        <Col xs="auto">
          <ProfileImage src={imageCache.get(message.token_identifier)} />
        </Col>
        <Col>
          <div>
            <b>#{message.token_identifier || "Unknown"}</b> · <span className="text-muted">{timeAgo.format(new Date(message.created))}</span>
          </div>
          <div>
            {message.body}
          </div>
          <div className="mt-2">
            <a href="#" className={`link-unstyled ${message.replies.length === 0 ? 'text-muted' : ''}`} onClick={(e) => {
              e.preventDefault();
              setReplying(!replying);
            }}>
              {message.replies.length} <i className="mdi mdi-message h6"></i>
            </a>
          </div>
        </Col>
      </Row>
      { replying && (
        <div>
          {message.replies.map(reply => (
            <>
              <hr style={{borderColor: "#2a3038"}} />
              <Row className="mb-2">
                <Col xs="auto">
                  <ProfileImage src={imageCache.get(reply.token_identifier)} />
                </Col>
                <Col>
                  <div>
                    <b>#{reply.token_identifier || "Unknown"}</b> · <span className="text-muted">{timeAgo.format(new Date(reply.created))}</span>
                  </div>
                  <div>
                    {reply.body}
                  </div>
                </Col>
              </Row>
            </>
          ))}
          <hr style={{borderColor: "#2a3038"}} />
          <ReplyBox messageId={message.id} />
        </div>
      ) }
    </Card>
  )
}
export default MessageRow;