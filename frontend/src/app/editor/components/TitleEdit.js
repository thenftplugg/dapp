import React, { useState } from 'react';
import { Row, Col, FormControl } from 'react-bootstrap';

const TitleEdit = ({originalTitle, onUpdate, titleClass="h3"}) => {
  const [edit, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const _onUpdate = () => {
    onUpdate(newTitle).then((response) => {
      setEditMode(false);
    });
  }

  return edit ? (
    <FormControl
      className="mb-2"
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
      autoFocus
      onBlur={(e) => {
        setEditMode(false);
        setNewTitle("")
      }}
      onKeyDown={(e) => {
        if (e.key == 'Enter') {
          _onUpdate();
        }
      }}
    />
  ) : (
    <Row onClick={() => setEditMode(true)}>
      <Col xs="auto" className="show_on_hover">
        <div className={titleClass}>{originalTitle}</div>
      </Col>
      <Col className="hide">
        <i className="mdi mdi-pencil"></i>
      </Col>
    </Row>
  );
}

export default TitleEdit;