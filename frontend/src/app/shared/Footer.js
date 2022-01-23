import React, { Component } from 'react';

class Footer extends Component {
  render () {
    return (
      <footer className="footer">
        <div className="container-fluid">
          <div className="d-sm-flex justify-content-center justify-content-sm-between py-2 w-100">
            <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Made with <i className="text-danger mdi mdi-heart"></i> by <a href="https://twitter.com/crypticalphaio" target="_blank">Cryptic Alpha</a></span>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
