import React, { useContext, useState } from 'react';
import Drawing from './drawing/Drawing';
import CommunityContext from './context';
import ProfileImage from './common/ProfileImage';
import Messages from './Messages';
import Members from './members/Members';
import SimplePills from '../shared/SimplePills';
import { Container } from 'react-bootstrap';

const PAGE_DRAWING = 'drawing';
const PAGE_MESSAGES = 'messages';
const PAGE_MEMBERS = 'members';

const Community = (props) => {
  const { community, imageCache, chosenToken } = useContext(CommunityContext);
  const [currentPage, setCurrentPage] = useState(PAGE_DRAWING);
  return (
    <div>
      <div style={{height: '0px'}}>
      {chosenToken && (
        <div>
          <ProfileImage src={imageCache.get(chosenToken.token_id)} />
        </div>
      )}
      </div>
      <h3 className="text-center mb-2 mt-2">{community.name}</h3>
      <Container className="text-center mb-5">
        <SimplePills
          pills={[
            [PAGE_DRAWING, 'Canvas'],
            [PAGE_MESSAGES, 'Messages'],
            [PAGE_MEMBERS, 'Members'],
          ]}
          onChange={setCurrentPage}
          selected={currentPage}
        />
      </Container>

      {currentPage === PAGE_DRAWING && (
        <Drawing />
      )}
      {currentPage === PAGE_MESSAGES && (
        <Container>
          <Messages />
        </Container>
      )}
      {currentPage === PAGE_MEMBERS && (
        <Container>
          <Members />
        </Container>
      )}
    </div>
  );
}

export default Community;
