import React, { useContext, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import DeleteModal from "./components/DeleteModal";
import AssetModal from "./components/AssetModal";
import TitleEdit from "./components/TitleEdit";
import AssetImage from "./components/AssetImage";
import LinkBar from "./components/LinkBar";
import EditorContext from './context';
import axios from "axios";
import { buildRoute } from '../auth/client/routes';
import { rarityTotal } from './utils';


const Index = ({ currentLayer, currentGroup, assets, setAssets, reloadProject }) => {
  const { project } = useContext(EditorContext);
  const [saved, setSaved] = useState(true);
  const onDelete = (type, id) => axios
    .delete(buildRoute(`/editor/${type}/${id}`))
    .then(r => reloadProject());


  const tutorialText = (text) => (
    <Col xs={12} className="grid-margin stretch-card">
      <div className="text-muted">{text}</div>
    </Col>
  );

  let totalRarities = rarityTotal(assets);

  const groupCrumb = !currentLayer && currentGroup && (
    <>
      <div className="d-flex">
        <TitleEdit
          originalTitle={currentGroup.name}
          onUpdate={(e) => (
            axios.put(
              buildRoute(`/editor/groups/${currentGroup.id}/`),
              { name: e, project: project.id }
            )
          )}
        />
        <div className="ml-auto">
          <DeleteModal
            onDelete={() => onDelete("groups", currentGroup.id)}
            name={currentGroup.name}
          />
        </div>
      </div>
      <Row>{tutorialText("Choose a layer to add some images")}</Row>
    </>
  );

  return (
    <div className="h-100">
      {!currentGroup && (
        <div>
          <Row>
            <Col xs={12} className="grid-margin stretch-card">
              <div className="text-muted">Choose a group to get started or <a href="https://www.youtube.com/watch?v=QQ1qpvrER5o" target="_blank">watch a tutorial</a>.</div>
            </Col>
          </Row>
          <LinkBar links={project} />
        </div>
      )}
      {groupCrumb}
      {currentLayer && (
        <div>
          <div className="d-flex">
            <TitleEdit
              originalTitle={currentGroup.name}
              onUpdate={(e) => (
                axios.put(
                  buildRoute(`/editor/groups/${currentGroup.id}/`),
                  { name: e, project: project.id }
                ).then(r => reloadProject())
              )}
            />
            <div className="mx-3">/</div>
            <TitleEdit
              originalTitle={currentLayer.name}
              onUpdate={(e) => (
                axios.put(
                  buildRoute(`/editor/layers/${currentLayer.id}/`),
                  { name: e, order: currentLayer.order, group: currentGroup.id }
                ).then(r => reloadProject())
              )}
            />
            <div className="ml-auto">
              {assets.length > 0 && 
                <AssetModal assets={assets} setAssets={setAssets} setSaved={setSaved}/>
              }
              <DeleteModal onDelete={() => onDelete('layers', currentLayer.id)} name={currentLayer.name}/>
            </div>
          </div>
          {!saved && <div className="text-danger">Unsaved changes!</div>}
          <Row>
            {assets.length === 0 ? 
              tutorialText("Nothing here, drag and drop or click anywhere to upload images!") :
              assets.map((asset, idx) => {
                return (
                  <Col xs={'auto'} className="grid-margin stretch-card" key={'asset' + idx}>
                    <AssetImage currentLayer={currentLayer} totalRarities={totalRarities} asset={asset} />
                  </Col>
                )
              })
            }
          </Row>
        </div>
      )}
    </div>
  );
}

export default Index;
