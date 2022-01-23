import React, { useRef, useState } from 'react';
import { Card, Modal, Form, Button, InputGroup, Image } from 'react-bootstrap'
import axios from 'axios';
import { buildRoute } from '../../auth/client/routes';
import { MAX_IMAGE_DIMENSION } from '../../constants';

const _randomProjectSuggestion = () => {
  const names = [
    "Crazy Chickens",
    "Muffin Mania",
    "Dope-Ass Donkeys",
    "Cool Chimps",
    "Terrible Pterodactyls",
  ];
  const descriptions = [
    "The craziest chickens in the coop.",
    "Your local muffin bakery. On the blockchain.",
    "10000 unique asses living on the Ethereum blockchain.",
    "A community of the coolest chimps on the chain.",
    "Prehistoric troublemakers, on chain",
  ];
  const index = Math.floor(Math.random() * names.length);
  return {name: names[index], description: descriptions[index]};
}

export default function EditProjectSettings({resyncProject, project, show, setShow}) {
  const inputFile = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [randomProject, _] = useState(_randomProjectSuggestion());
  const [newProject, setNewProject] = useState(project);
  const deleteProject = () => {
    setIsSaving(true);
    axios.delete(buildRoute(`/editor/projects/${project.id}/`)).then(() => {
      setIsSaving(false);
      window.location.href = "/projects";
    }).catch(() => {
      setIsSaving(false);
    })
  }
  const validate = () => {
    const newErrors = {}
    if (newProject.width > MAX_IMAGE_DIMENSION || newProject.height > MAX_IMAGE_DIMENSION) {
      newErrors.dimensions = `Max width and height is ${MAX_IMAGE_DIMENSION}px`;
    }
    if (newProject.width < 0 || newProject.height < 0) {
      newErrors.dimensions = `Invalid width and height`;
    }
    let layers = project.groups.map(g => g.layers).flat()
    let assets = layers.map(l => l.assets).flat()
    if ((newProject.ispublic || newProject.listed) && assets.length === 0) {
      newErrors.noAssets = `Project must have at least 1 image before making it public!`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const save = () => {
    if (!validate()) {
      return;
    }
    setIsSaving(true);
    axios.put(buildRoute(`/editor/projects/${project.id}/`), newProject).then(() => {
      resyncProject();
      setIsSaving(false);
      setShow(false);
    }).catch(() => {
      setIsSaving(false);
    })
  }
  const saveImage = (e) => {
    setIsSaving(true);
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('profile_image', file)
    setProfileImage(URL.createObjectURL(file))
    axios.put(
      buildRoute(`/editor/projects/${project.id}/`),
      formData,
      { headers: {'Content-Type': 'multipart/form-data'} }
    ).then(() => {
      setIsSaving(false);
    }).catch(() => {
      setIsSaving(false);
    })
  }

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <input
        accept="image/*"
        type='file'
        ref={inputFile}
        style={{display: 'none'}}
        onChange={saveImage}
      />
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3 text-center">
              <span className="pointer" onClick={() => {
                  setIsSaving(true);
                  if (!isSaving) {
                    inputFile.current.click();
                  }
              }}>
                {(project.profile_image_url || profileImage) && (
                  <Image height="150" className="" src={project.profile_image_url || profileImage} />
                )}
                {!(project.profile_image_url || profileImage) && (
                  <i className="mdi mdi-image display-1" />
                )}
              </span>
            </Form.Group>
            <Form.Group className="mb-3" controlId="project-name">
              <Form.Label>Project Name</Form.Label>
              <Form.Control onChange={(e) => setNewProject({...newProject, name: e.target.value})} value={newProject.name} placeholder={randomProject.name} />
              <Form.Text className="text-muted">
                This will show up in the final build, no pressure.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="project-description">
              <Form.Label>Project Description</Form.Label>
              <Form.Control onChange={(e) => setNewProject({...newProject, description: e.target.value})} value={newProject.description} placeholder={randomProject.description} />
              <Form.Text className="text-muted">
                This will also show up in the final build.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <InputGroup>
                <InputGroup.Text className="input-group-prepend">https://</InputGroup.Text>
                <Form.Control onChange={(e) => setNewProject({...newProject, website: e.target.value})} value={newProject.website} />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>OpenSea</Form.Label>
              <InputGroup>
                <InputGroup.Text className="input-group-prepend">opensea.io/collection/</InputGroup.Text>
                <Form.Control onChange={(e) => setNewProject({...newProject, opensea: e.target.value})} value={newProject.opensea} />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Twitter</Form.Label>
              <InputGroup>
                <InputGroup.Text className="input-group-prepend">@</InputGroup.Text>
                <Form.Control onChange={(e) => setNewProject({...newProject, twitter: e.target.value})} value={newProject.twitter} />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discord</Form.Label>
              <InputGroup>
                <InputGroup.Text className="input-group-prepend">discord.com/invite/</InputGroup.Text>
                <Form.Control onChange={(e) => setNewProject({...newProject, discord: e.target.value})} value={newProject.discord} />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etherscan</Form.Label>
              <InputGroup>
                <InputGroup.Text className="input-group-prepend">etherscan.io/address/</InputGroup.Text>
                <Form.Control onChange={(e) => setNewProject({...newProject, etherscan: e.target.value})} value={newProject.etherscan} />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="public">
              <Form.Label>Dimensions</Form.Label>
              <div className="row form-group">
                <div className="col">
                  <InputGroup>
                    <Form.Control onChange={(e) => setNewProject({...newProject, width: e.target.value})} value={newProject.width} placeholder="512" />
                    <InputGroup.Text className="input-group-append">px</InputGroup.Text>
                  </InputGroup>
                </div>
                <div className="text-muted col-auto" style={{display: 'flex', alignSelf: 'center'}}>
                  x
                </div>
                <div className="col">
                  <InputGroup>
                    <Form.Control onChange={(e) => setNewProject({...newProject, height: e.target.value})} value={newProject.height} placeholder="512" />
                    <InputGroup.Text className="input-group-append">px</InputGroup.Text>
                  </InputGroup>
                </div>
              </div>
              <div className="text-danger">{errors.dimensions}</div>
            </Form.Group>

            <Form.Label>Visibility</Form.Label>
            <Form.Group className="mb-3" controlId="public">
              <Form.Check type="checkbox" label="Is Public" checked={newProject.ispublic} onClick={(e) => {
                setNewProject({...newProject, ispublic: !newProject.ispublic});
              }} />
              <Form.Text className="text-muted">
                Make this link shareable.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="listed">
              <Form.Check type="checkbox" label="Is Listed" checked={newProject.listed} onClick={(e) => setNewProject({...newProject, listed: !newProject.listed})} />
              <Form.Text className="text-muted">
                We will put this project on our homepage!
              </Form.Text>
            </Form.Group>

            <div>
              <div className="text-danger my-4">{errors.noAssets}</div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Button variant="success" disabled={isSaving} onClick={save}>
                { !isSaving && "Save" }
                { isSaving && "..." }
              </Button>
              <Button variant="danger" disabled={isSaving} onClick={deleteProject}>
                Delete Project
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Modal>
  )
}
