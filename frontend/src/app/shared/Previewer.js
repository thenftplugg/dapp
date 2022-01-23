import React, { Component } from 'react';

class Previewer extends Component {

  render () {
    return (
      <div className="sidebar sidebar-offcanvas pt-5" id="previewer">
        <div className="card pt-2">
          <div className="card-body">
            <canvas id="canvas" width="200" height="200"></canvas> 
          </div>
        </div>
      </div>
    );
  }

}

export default Previewer;