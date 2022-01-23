import React, { useContext, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import AuthModal from '../auth/AuthModal';
import { logout } from '../auth/utils';
import AppContext from '../contexts';
import md5 from 'blueimp-md5';
import UserProfile from '../user/UserProfile';
import HelpTip from '../community/common/HelpTip';

export function stringToIntHash(str, upperbound, lowerbound) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = result + str.charCodeAt(i);
  }

  if (!lowerbound) lowerbound = 0;
  if (!upperbound) upperbound = 500;

  return (result % (upperbound - lowerbound)) + lowerbound;
}

const randomColor = (key) => {
  const val = md5(key).substring(0, 4);
  const integer = stringToIntHash(val)
  const choices = [
    'light',
    'success',
    'danger',
    'info',
    'warning',
    'primary',
    'secondary',
  ]
  return choices[integer % choices.length];
}

function Navbar({expandRightSidebar, faded = false}) {
  const { loggedIn, user } = useContext(AppContext);
  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const filter = new URLSearchParams(window.location.search).get('q')
  const [searchQuery, setSearchQuery] = useState(filter);
  const performSearch = () => {
    const location = window.location;
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('q', searchQuery);
    window.location.href = location.protocol + '//' + location.host + "?" + queryParams.toString()
  }

  return (
    <nav
      style={{
        left: '0px',
        right: expandRightSidebar ? '500px' : null,
        backgroundColor: faded ? 'black' : '#191c24',
      }}
      className={`navbar p-0 d-flex flex-row ${!faded && 'fixed-top'}`}
    >
      <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
        <div className="navbar-brand-wrapper d-flex align-items-center justify-content-center" style={{
          backgroundColor: faded ? 'black' : '#191c24',
        }}>
          <a className="navbar-brand h1 text-light mb-0" href="/">Cryptic Alpha</a>
        </div>

        <ul className="navbar-nav w-100">
          <li className="nav-item">
            <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search">
              <input
                value={searchQuery}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    performSearch()
                  }
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
                type="text"
                className="w-100 form-control"
                placeholder="Search Projects"
              />
            </form>
          </li>
          <li className="nav-item d-none d-lg-block dropdown">
            <Button
              variant="success"
              className="nav-link create-new-button no-caret dropdown-toggle"
              onClick={() => {
                performSearch();
              }}
            >
              Search
            </Button>
          </li>
        </ul>

        <ul className="navbar-nav w-100 d-lg-none"></ul>
          <ul className="navbar-nav navbar-nav-right">
        { loggedIn && user && (
          <>
            <HelpTip text="stats" placement="bottom">
              <li className="nav-item">
                <a className="nav-link" href="/stats">
                  <span className="d-none d-sm-block">Stats</span>
                  <i className="mdi mdi-chart-bell-curve-cumulative d-sm-none"></i>
                </a>
              </li>
            </HelpTip>
            <Dropdown alignRight as="li" className="nav-item">
              <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
                <div className="navbar-profile">
                  {user?.username && <i className={`mdi mdi-alpha-${user.username[0]}-circle text-${randomColor(user.username)}`} style={{fontSize: '2em'}}></i>}
                  <p className="mb-0 d-none d-sm-block navbar-profile-name">{user.username}</p>
                  <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                  <i className="mdi mdi-account text-white d-sm-none"></i>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
                <h6 className="p-3 mb-0">Profile</h6>
                <Dropdown.Divider />
                <Dropdown.Item  href="/?filter=own" className="preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-star text-info"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Your Projects</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item  onClick={() => setShowUserProfile(!showUserProfile)} className="preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-settings text-success"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Settings</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout} className="preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-logout text-danger"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Log Out</p>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) }
        { (!loggedIn || !user) && (
          <>
            <li className="nav-item">
              <a className="nav-link btn btn-success create-new-button" onClick={(e) => {
                setShowAuthModal(true)
                e.preventDefault();
              }}>
                Sign Up
              </a>
            </li>
          </>
        ) }
          </ul>
        { document.querySelector('.sidebar-offcanvas') && 
          <button className="ml-auto navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
            <span className="mdi mdi-format-line-spacing"></span>
          </button>
        }
      </div>
      <AuthModal show={showAuthModal} />
      {showUserProfile && <UserProfile show={showUserProfile} setShow={setShowUserProfile} user={user} />}
    </nav>
  );
}

export default Navbar;
