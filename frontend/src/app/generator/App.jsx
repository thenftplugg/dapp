import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../shared/Navbar';
import axios from "axios";
import { buildRoute } from '../auth/client/routes';
import { Container } from 'react-bootstrap';
import GenerationParameters from './GenerationParameters';
import PromotionalAlert from './PromotionalAlert';
import { Link } from 'react-router-dom';

export default function App(props) {
  const [project, setProject] = useState(null);

  useEffect(() => {
    let path = `/editor/projects/${props.match.params.projectId}/`
    axios.get(buildRoute(path))
      .then(function(response) {
        setProject(response.data)
      }).catch((error) => {
        if (error.response) {
          window.location.href = `/projects`;
        }
      });
  }, [])
  return (
    <div>
      <Navbar /> 
      <div className="mt-5 content-wrapper page-body-wrapper">
        <Container>
          <Link to={`/projects/${props.match.params.projectId}`}>
            <div>
              <i className="mdi mdi-arrow-left"></i>
              Go Back
            </div>
          </Link>
          <PromotionalAlert />
          <div>
            {project && <GenerationParameters project={project} />}
          </div>
        </Container>
      </div>
    </div>
  )
}