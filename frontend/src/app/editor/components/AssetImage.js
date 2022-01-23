import axios from 'axios';
import { Notyf } from 'notyf';
import React, { useContext, useState } from 'react';
import { Button, Badge, Row, Col } from 'react-bootstrap';
import { buildRoute } from '../../auth/client/routes';
import HelpTip from '../../community/common/HelpTip';
import EditorContext from '../context';
import { DeleteModalBody } from './DeleteModal';


const AssetImage = ({asset, totalRarities, currentLayer}) => {
  const { composerAssetByLayerId, setComposerAssetByLayerId, setExpandRightSidebar, resyncProject } = useContext(EditorContext);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  let totalRarity = (asset.rarity / totalRarities) * 100 || 0
  let style = {}
  if (asset.isLoading) style.opacity = 0.5
  let badgeColor = "info";
  if (totalRarity < 10) badgeColor = "danger";
  const isPinned = composerAssetByLayerId[currentLayer.id] === asset.id;
  return (
    <div className="asset-image">
      { openDeleteModal &&
        <DeleteModalBody
          image={asset.image_file}
          handleClose={() => setOpenDeleteModal(false)}
          handleDelete={async () => {
            await axios.delete(buildRoute(`/editor/assets/${asset.id}/`))
            await resyncProject();
            const notyf = new Notyf();
            notyf.error(`Deleted ${asset.name}`);
            setOpenDeleteModal(false);
          }}
          name={asset.name}
        /> }
      <img src={asset.image_file} style={{ width: "100%", ...style }} alt="" />
      <div className="text-shadow text-info top-rounded small p-2">
        <Row>
          <Col>
            {asset.name.slice(0, 22)}{asset.name.length > 25 ? "..." : asset.name.slice(22, 25)} <br />
            <HelpTip text="rarity" placement="bottom">
              <Badge className={`btn-inverse-${badgeColor}`} style={{ padding: "3px 4px 3px 3px" }}>{totalRarity.toFixed(1)}%</Badge>
            </HelpTip>
          </Col>
          <Col className="text-right">
            <Button size='sm' variant={isPinned ? "primary" : "outline-secondary"} onClick={() => {
              setExpandRightSidebar(true);
              if (composerAssetByLayerId[currentLayer.id] === asset.id) {
                const newComposerAssetByLayerId = {...composerAssetByLayerId}
                delete newComposerAssetByLayerId[currentLayer.id];
                setComposerAssetByLayerId(newComposerAssetByLayerId);
              } else {
                const newComposerAssetByLayerId = {...composerAssetByLayerId}
                newComposerAssetByLayerId[currentLayer.id] = asset.id;
                setComposerAssetByLayerId(newComposerAssetByLayerId);
              }
            }}>
              <i className={`mdi ${isPinned ? "mdi-lock" : "mdi-lock-open-variant-outline"}`}></i> Pin
            </Button>
            <Button size='sm' className="ml-1" variant="outline-danger" onClick={() => {
              setOpenDeleteModal(true);
            }}>
              <i className="mdi mdi-delete unstyled"></i>
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}


export default AssetImage;
