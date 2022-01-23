import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';

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

const Sidebar = ({projects}) => {
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


  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
        <a className="sidebar-brand brand-logo h1 text-light" href="index.html">Cryptic ALpha</a>
        <a className="sidebar-brand brand-logo-mini h1 text-light" href="index.html">CA</a>
      </div>
      <ul className="nav">
        <li className="nav-item profile">
          <div className="profile-desc">
            <div className="profile-pic">
              <div className="profile-name">
                <h5 className="mb-0 font-weight-normal">Your Projects</h5>
              </div>
            </div>
          </div>
        </li>
        {projects && projects.map((p, idx) => {
          return (
            <li className="nav-item menu-items">
              <Link className="nav-link" to={`/projects/${p.slug}`}>
                <span className="menu-icon"><i className={"mdi mdi-emoticon" + (EMOTIONS[idx] ? EMOTIONS[idx] : "")}></i></span>
                <span className="menu-title">{p.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  );
}


  
export default withRouter(Sidebar);