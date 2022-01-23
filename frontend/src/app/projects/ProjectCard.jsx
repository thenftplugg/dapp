import React, { useState } from 'react';
import LinkBar from '../editor/components/LinkBar';
import HelpTip from '../community/common/HelpTip';
import RotatingImage from './RotatingImage';


export default function ProjectCard({project}) {
  let layers = project.groups.map(g => g.layers).flat()
  let assets = layers.map(l => l.assets).flat()
  const [hover, setHover] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const badge = () => {
    if (project.listed) {
      return <div className="badge badge-success ml-auto">Public</div>
    }

    if (project.ispublic) {
      return <div className="badge badge-info ml-auto">Shareable</div>
    }

    return <div className="badge badge-primary ml-auto">Private</div>
  }

  const buildDescription = () =>  {
    return project.description && (
    <>
      <p>
      {project.description.substring(0, 240)}{showFullText && project.description.substring(240, project.description.length)}
      {project.description.length > 240 && !showFullText &&
        <a onClick={() => setShowFullText(true)}  href={"#collapseDescription" + project.slug} >
          ...see more
        </a>
      }
      </p>
    </>
    )
  }
  
  return (
    <div className="project-grid pointer card h-100" onMouseEnter={() => {
      setHover(true);
    }} onMouseOut={() => {
      setHover(false);
    }}>
      <div className="img-holder img-bg-1" onClick={() => window.location = `/projects/${project.slug}`}>
        <RotatingImage project={project} rotating={hover} />
      </div>
      <div className="project-grid-inner">
        <div className="project-grid-inner-top">
          <div className="d-flex align-items-start" onClick={() => window.location = `/projects/${project.slug}`}>
            <div className="wrapper">
              <h5 className="project-title">{project.name}</h5>
              <p className="project-location"><i className="mdi mdi-image-area mr-2"></i>{project.width} x {project.height}</p>
            </div>
            {badge()}
          </div>
          {buildDescription()}
        </div>

        <div className="project-grid-inner-bottom">
          <div className="d-flex justify-content-between align-items-center flex-wrap" onClick={() => window.location = `/projects/${project.slug}`}>
            <div className="action-tags d-flex flex-row">
              <HelpTip text="layers">
                <div className="wrapper pr-4">
                  <i className="mdi mdi-view-sequential mr-2"></i>{layers.length}
                </div>
              </HelpTip>
              <HelpTip text="assets">
                <div className="wrapper">
                  <i className="mdi mdi-image-multiple mr-2"></i>{assets.length}
                </div>
              </HelpTip>
            </div>
          </div>
          <div className="mt-3">
            <LinkBar links={project} icons={true} />
          </div>
        </div>
      </div>
    </div>  
  )
}


