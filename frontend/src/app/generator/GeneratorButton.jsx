import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function GeneratorButton({project, expandRightSidebar, setExpandRightSidebar}) {
  return (
    <div id="start-generation">
      <Button className="large-button mr-3" onClick={() => setExpandRightSidebar(!expandRightSidebar)} variant="outline-primary" size="lg">
        {!expandRightSidebar && (
          <span>
            Workspace
            <i className="mdi mdi-lightbulb ml-1"></i>
          </span>
        )}
        {expandRightSidebar && (
          <span>
            Hide
            <i className="mdi mdi-lightbulb-outline ml-1"></i>
          </span>
        )}
      </Button>
    </div>
  );
}