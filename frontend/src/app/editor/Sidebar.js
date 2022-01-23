import React, { useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import SidebarGroup from './components/SidebarGroup';
import axios from "axios";
import { buildRoute } from '../auth/client/routes';
import EditorContext from './context';
import EditProjectSettings from './components/EditProjectSettings';
import { createPreviewImages } from '../generator/utils';
import HelpTip from '../community/common/HelpTip';

const EMOTIONS = [
  "",
  "-cool",
  "-devil",
  "-happy",
  "-neutral",
  "-poop",
  "-sad",
  "-tongue"
]

const Sidebar = ({expandRightSidebar, setExpandRightSidebar, isProjectOwner=false}) => {
  const {
    project,
    selected,
    resyncProject,
  } = useContext(EditorContext);
  const [newGroupName, setNewGroupName] = useState(null);
  const [showEditProjectSettingsModal, setShowEditProjectSettingsModal] = useState(false);
  const [baseUrls, setBaseUrls] = useState([]);
  const navRef = useRef(null);

  useEffect(() => {
    createPreviewImages(project, setBaseUrls);
  }, [project])

  useEffect(() => {
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  },[])

  const createNewGroup = (name) => {
    axios.post(
      buildRoute('/editor/groups/'),
      {project: project.id, name: name}
    ).then((response) => {
      // Reload projects
      resyncProject();
    })
  }

  return (
    <nav className={`sidebar sidebar-offcanvas ${!selected.layerId && "active"}`} id="sidebar">
      <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
        <a className="sidebar-brand brand-logo h1 text-light" href="/">Cryptic Alpha</a>
        <a className="sidebar-brand brand-logo-mini h1 text-light" href="/">RM</a>
      </div>
      <ul className="nav nav-with-generation" style={{"--generate-height": `${isProjectOwner && navRef.current?.clientHeight + 20}px`}}>
        <li className="nav-item profile">
          <div className="profile-desc">
            <div className="profile-pic">
              <div className="count-indicator">
                { baseUrls[0] && <img className="img-xs rounded-circle" src={baseUrls[0]} alt="profile" /> }
              </div>
              <div className="profile-name">
                <div className="mb-0 font-weight-normal h5">{project.name}</div>
              </div>
            </div>
            <Dropdown alignRight>
              <Dropdown.Toggle as="a" className="cursor-pointer no-caret">
                <i className="mdi mdi-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu className="sidebar-dropdown preview-list">
                <a href="!#" className="dropdown-item preview-item" onClick={evt =>evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-settings text-primary"></i>
                    </div>
                  </div>
                  <div className="preview-item-content" onClick={() => setShowEditProjectSettingsModal(true)}>
                    <p className="preview-subject ellipsis mb-1 text-small">Project settings</p>
                  </div>
                </a>
              </Dropdown.Menu>
            </Dropdown>
            { showEditProjectSettingsModal && (
              <EditProjectSettings resyncProject={resyncProject} show={showEditProjectSettingsModal} project={project} setShow={setShowEditProjectSettingsModal} />
            ) }
          </div>
        </li>
        <li className="nav-item nav-category">
          <span className="nav-link">Groups</span>
        </li>
        {project.groups.map((group, idx) => (
          <SidebarGroup
            key={group.name + idx}
            group={group}
            icon={EMOTIONS[idx] ? EMOTIONS[idx] : ""}
            resyncProject={resyncProject}
          />
        ))}
        { newGroupName === null && (
          <li className='nav-item menu-items my-1'>
            <HelpTip text="add a group to your collection with their own layers and rarities" placement="bottom">
              <Button block className="nav-link btn-info text-white" onClick={() => setNewGroupName('')}>
                + Group
              </Button>
            </HelpTip>
          </li>
        ) }
        { newGroupName !== null && (
          <li className='nav-item menu-items my-1'>
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  createNewGroup(newGroupName);
                  setNewGroupName(null);
                }
              }}
              autoFocus
              onBlur={() => setNewGroupName(null)}
              onChange={(e) => setNewGroupName(e.target.value)}
              value={newGroupName || ''}
              className="form-control"
            />
          </li>
        ) }
      </ul>
      {isProjectOwner &&
        <div className="nav-bottom" ref={navRef}>
          <div>
            {expandRightSidebar ? (
              <Button block className="large-button mb-2" onClick={() => setExpandRightSidebar(false)} variant="outline-primary" size="lg">
                Hide
                <i className="mdi mdi-lightbulb-off ml-1"></i>
              </Button>
            ) : (
              <HelpTip text="preview your collection and download samples">
                <Button block className="large-button mb-2" onClick={() => setExpandRightSidebar(true)} variant="outline-primary" size="lg">
                  Workspace
                  <i className="mdi mdi-lightbulb ml-1"></i>
                </Button>
              </HelpTip>
            )}
          </div>
          <div>
            <Button block className="large-button mb-2" disabled={!project.id} href={`/projects/${project.slug}/generate`} variant="success" size="lg">
              Generate Images
              <i className="mdi mdi-arrow-right ml-1"></i>
            </Button>
          </div>
        </div>
      }
    </nav>
  );
}


  
export default withRouter(Sidebar);
