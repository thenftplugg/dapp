import React, { useContext, useEffect, useState } from 'react';
import { Notyf } from 'notyf';
import Index from './Index';
import EditorContext from './context';
import Sidebar from './Sidebar';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import axios from "axios";
import Dropzone from 'react-dropzone';
import { Row, Col, Modal } from 'react-bootstrap';
import { buildRoute } from '../auth/client/routes';
import UploadPrompt from '../basic-ui/UploadPrompt';
import Preview from '../generator/Preview';
import { useMediaQuery } from 'react-responsive'
import AppContext from '../contexts';

const buildBaseUrl = (location) => {
  return location.protocol + '//' + location.host + location.pathname
}
export default function App(props) {
  const  { user } = useContext(AppContext);
  const notyf = new Notyf();
  const [selected, _setSelected] = useState({groupId: null, layerId: null});
  const [expandRightSidebar, setExpandRightSidebar] = useState(false);
  const [composerAssetByLayerId, _setComposerAssetByLayerId] = useState({});
  const setComposerAssetByLayerId = (d) => {
    _setComposerAssetByLayerId(d)
  }

  const setSelected = (selected) => {
    const params = new URLSearchParams(window.location.search);
    if (selected.groupId) params.set('group_id', selected.groupId);
    if (selected.layerId) params.set('layer_id', selected.layerId);
    const newUrl = buildBaseUrl(window.location) + "?" + params.toString()
    window.history.pushState({}, null, newUrl);
    _setSelected(selected);
  }

  const [project, setProject] = useState({
    name: '',
    groups: [],
  });

  const resyncProject = () => {
    let path = `/editor/projects/${props.match.params.projectId}/`
    axios.get(buildRoute(path))
      .then(function(response) {
        setProject(response.data)
      }).catch((error) => {
        if (error.response) {
          window.location.href = `/projects`;
        }
      });
  }

  useEffect(() => {
    resyncProject();
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get('group_id')
    const layerId = params.get('layer_id')
    setSelected({groupId: groupId, layerId: layerId})
  }, []);
  const [assets, setAssets] = useState([]);

  const currentGroup = project.groups.find(g => g.id === selected.groupId);
  let currentLayer;
  if (currentGroup) {
    currentLayer = currentGroup.layers.find(l => l.id === selected.layerId);
  }

  useEffect(() => {
    setAssets(currentLayer?.assets || [])
  }, [currentLayer])
  const [files, setFiles] = useState([]);

  const uploadFile = async (file, idx) => {
    var formData = new FormData();
    formData.append("image_file", file);
    formData.append("layer", selected.layerId);
    formData.append("rarity", 0);
    formData.append("name", file.name.split(".")[0]);
    return axios.post(
      buildRoute('/editor/assets/'),
      formData,
      { headers: {'Content-Type': 'multipart/form-data'} }
    )
  }
  const uploadFiles = async () => {
    let collection = [...assets]
    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      if (["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)) {
        await uploadFile(file, idx)
          .then(response => {
            collection[idx] = response.data;
          })
          .catch(e => {
            const data = e.response.data
            if (data.message) {
              notyf.error(data.message);
            } else if (Object.keys(data).length > 0) {
              Object.keys(data).map(key => {
                data[key].map(er => notyf.error(er))
              });
            }
            collection[idx] = {...collection[idx], failed: true}
          });
      }
      setAssets(collection);
    }
  }

  useEffect(() => {
    uploadFiles();
  }, [files])

  const onSaveFile = (files) => {
    const originalFileArray = files.map((x, idx) => {
      if (["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(x.type) && x.size <= 20000000) {
       return ({ image_file: URL.createObjectURL(x), name: x.name.split('.')[0], rarity: 0, isLoading: true })
      }
    }).filter(x => x)
    // TODO: add error text that we dont accept other files than jpg, png, or gif
    if (originalFileArray.length !== files.length) {
      notyf.error('We only accept images that are PNG, JPEG or GIF files that are less than 20MB');
    }
    setAssets(originalFileArray.concat(assets));
    setFiles(files);
  };

  const isBigScreen = useMediaQuery({ query: '(min-width: 768px)' })
  const emptyAssets = assets.length === 0;

  return (
    <EditorContext.Provider value={{
      project: project,
      selected: selected,
      setSelected: setSelected,
      resyncProject: resyncProject,
      composerAssetByLayerId: composerAssetByLayerId,
      setComposerAssetByLayerId: setComposerAssetByLayerId,
      setExpandRightSidebar: setExpandRightSidebar
    }}>
      <div className="container-scroller">
        <Sidebar expandRightSidebar={expandRightSidebar} setExpandRightSidebar={setExpandRightSidebar} isProjectOwner={user?.id === project.user_id} />
        <div className="container-fluid page-body-wrapper">
          <Navbar expandRightSidebar={expandRightSidebar} setExpandRightSidebar={setExpandRightSidebar} /> 
          <Row>
            <Col className="main-editor">
              <Dropzone onDrop={acceptedFiles => onSaveFile(acceptedFiles)}>
                {({getRootProps, getInputProps, isDragActive}) => (
                  <div className={`main-panel ${emptyAssets && 'pointer'}`}
                    {...getRootProps({
                      onClick: e => {
                        if (!emptyAssets || !selected.layerId) {
                          e.stopPropagation();
                        }
                      }
                    })}
                  >
                    {emptyAssets && <input {...getInputProps()} />}
                    <div className="content-wrapper">
                      <Index
                        currentLayer={currentLayer}
                        assets={assets.filter(x => !x.failed)}
                        setAssets={setAssets}
                        reloadProject={resyncProject}
                        currentGroup={currentGroup}
                      />
                    </div>
                    {currentLayer && <UploadPrompt active={isDragActive} {...getRootProps()}/>}
                    <Footer/>
                  </div>
                )}
              </Dropzone>

            </Col>
            { expandRightSidebar && isBigScreen && (
              <Col xs="auto" className="right-sidebar">
                <Preview project={project} group={currentGroup} />
              </Col>
            ) }
            { expandRightSidebar && !isBigScreen && (
              <Modal style={{height: '90vh'}} show={true} onHide={() => setExpandRightSidebar(false)}>
                <Preview project={project} group={currentGroup} />
              </Modal>
            ) }
          </Row>
        </div>
      </div>
    </EditorContext.Provider>
  )
}
