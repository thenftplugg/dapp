import React from 'react';

export default function AddProjectCard({project, createNewProject}) {
  return (
    <div onClick={createNewProject} className="project-grid pointer project-card h-100 card bg-dark pointer border-white-dashed">
      <div className="card-body text-center d-flex" style={{alignItems: 'center', justifyContent: 'center'}}>
        <div>
          <h3>Add new project</h3>
          <h1 className="mt-2">+</h1>
        </div>
      </div>
    </div>
  );
}