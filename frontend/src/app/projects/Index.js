import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { buildRoute } from '../auth/client/routes';
import ProjectCard from './ProjectCard';
import AddProjectCard from './AddProjectCard';
import SignUpToAddProjectCard from './SignUpToAddProjectCard';
import Navbar from '../shared/Navbar';
import SimplePills from '../shared/SimplePills';
import Footer from '../shared/Footer';
import { isLoggedIn } from '../auth/utils';
import Spinner from '../shared/Spinner';
import { Button } from 'react-bootstrap';
import AppContext from '../contexts';


const Index = () => {
  const { loggedIn } = useContext(AppContext);
  const [projects, setProjects] = useState([]);
  const [nextPagination, setNextPagination] = useState(null);

  const filter = new URLSearchParams(window.location.search).get('filter') || 'public';
  const search = new URLSearchParams(window.location.search).get('q') || "";
  const [loading, setLoading] = useState(true);

  const loadMoreProjects = (link) => {
    setLoading(true);
    axios.get(buildRoute(link))
      .then(function(response) {
        setProjects([...projects].concat(response.data.results))
        setNextPagination(response.data.next)
        setLoading(false);
      }).catch(() => {
      });
  }

  const fetchProjects = () => {
    setLoading(true);
    axios.get(buildRoute(`/editor/projects/?filter=${filter}&q=${search}`))
      .then(function(response) {
        setProjects(response.data.results)
        setNextPagination(response.data.next)
        setLoading(false);
      }).catch(() => {
      });
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const createNewProject = (e) => {
    axios.post(buildRoute('/editor/projects/'), {name: "Untitled Project"}).then((response) => {
      window.location.href = '/projects/' + response.data.slug;
    })
  }

  return (
    <div>
      <div>
        <Navbar fullWidth={true} />
        <div className="main-panel">
          <div className="content-wrapper">
            <div>
              <SimplePills pills={[['public', 'Public Projects'], loggedIn && ['own', 'Your Projects']].filter(x => x)} onChange={(filter) => {
                const location = window.location;
                const queryParams = new URLSearchParams(location.search);
                queryParams.set('filter', filter);
                window.location.href = location.protocol + '//' + location.host + location.pathname + "?" + queryParams.toString()
              }} selected={filter} />
              {!loading && projects.length === 0 && search && (
                <div className="text-center h3 font-weight-light my-5">
                  No projects found for "{search}"
                </div>
              )}
              <div className="row project-list-showcase">
                {projects.map((project, idx) => (
                  <div className="mt-4 col-auto">
                    <ProjectCard project={project} />
                  </div>
                ))}
                {isLoggedIn() && filter === 'own' && (
                  <div className="mt-4 col-auto">
                    <AddProjectCard createNewProject={createNewProject} />
                  </div>
                )}
                {!isLoggedIn() && (
                  <div className="mt-4 col-auto">
                    <SignUpToAddProjectCard />
                  </div>
                )}
              </div>
              {loading && (
                <div className="p-6 text-center">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
          <div className="text-center my-3">
            {nextPagination && !loading && <Button variant="outline-info" size="lg" onClick={() => {
              loadMoreProjects(nextPagination);
              console.log("Clicked!");
            }}>Load More Projects</Button>}
          </div>
          <Footer/>
        </div>
      </div>
    </div>
  );
}

export default Index;