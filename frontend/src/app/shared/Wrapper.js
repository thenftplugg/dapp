import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Wrapper = (props) => {
  return (
    <div className="container-scroller">
      <Sidebar {...props}/>
      <div className="container-fluid page-body-wrapper">
        <Navbar />
        <div className="main-panel">
          <div className="content-wrapper">
            {props.children}
          </div>
          <Footer/>
        </div>
      </div>
    </div>
  );
}


export default Wrapper;
