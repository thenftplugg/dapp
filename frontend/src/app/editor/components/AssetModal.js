import React, { useEffect, useState } from 'react';
import { Row, Col, FormControl, Button, Modal, InputGroup } from 'react-bootstrap';
import axios from "axios";
import { buildRoute } from '../../auth/client/routes';
import DeleteModal from "./DeleteModal";
import updateRarities, { rarityTotal } from "../utils";

const AssetModal = ({assets, setAssets, setSaved}) => {
  const [show, setShow] = useState(false);
  const [_assets, _setAssets] = useState()

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update = () => {
    _assets.map(asset => {
        var formData = new FormData();
        formData.append("rarity", Math.floor(asset.rarity * 1000));
        formData.append("name", asset.name);
        formData.append("layer", asset.layer);
      axios.put(
        buildRoute(`/editor/assets/${asset.id}/`),
        formData,
        { headers: {'Content-Type': 'multipart/form-data'} },
      ).then((response) => {
        handleClose();
      })
     })
    setAssets(_assets)
    setSaved(true);
  };

  // at least two unlocked to edit
  const ableToMoveSlider = assets.filter(x => !x.locked).length >= 2;

  const updateAsset = (id, name, value) => {
    const assetIndex = _assets.findIndex(a => id == a.id);
    const updatedAssets = [..._assets]
    if (name === "rarity" && ableToMoveSlider) {
      setAssets(updateRarities(updatedAssets, updatedAssets[assetIndex], value));
    } else if (name != "rarity") {
      updatedAssets[assetIndex] = {...updatedAssets[assetIndex], [name]: value};
      setAssets([...updatedAssets]);
    }
    setSaved(false);
  };

  useEffect(() => {
    let totalRarities = rarityTotal(assets);
    const a = assets.map(a => ({...a, rarity: (a.rarity / totalRarities) * 100}))
    _setAssets(a)
  },[assets])

  const onDelete = (asset) => axios
    .delete(buildRoute(`/editor/assets/${asset.id}/`))
    .then(r => {
      setAssets(_assets.filter(x => x.id != asset.id));
      _setAssets(_assets.filter(x => x.id != asset.id));
  });

  return <>
    <Button variant="" onClick={handleShow}>
      <i className="mdi mdi-settings text-primary"></i>
    </Button>
    {show &&
      <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rarity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {_assets.map(asset => (
            <Row>
              <Col xs={6}>
                <FormControl
                  value={asset.name}
                  onChange={(e) => {
                    updateAsset(asset.id, "name", e.target.value) 
                  }}
                  autoFocus
                />
              </Col>
              <Col xs="auto" className="text-center" style={{alignSelf: "center"}}>
               <i className={`pointer mdi mdi-lock-${asset.locked ? "outline" : "open-outline text-success"}`} onClick={() => updateAsset(asset.id, "locked", !asset.locked)}></i>
              </Col>
              <Col xs={4} style={{alignSelf: "center"}}>
                <InputGroup className="mb-3">
                  <FormControl
                    value={asset.rarity}
                    onChange={(e) =>updateAsset(asset.id, "rarity", parseFloat(e.target.value))}
                    min="0"
                    type="number"
                    disabled={asset.locked}
                    className={asset.locked ? "text-dark" : ""}
                  />
                  <InputGroup.Text className="input-group-append">%</InputGroup.Text>
                </InputGroup>
              </Col>
              <Col xs={1} style={{alignSelf: "center"}}>
                <DeleteModal image={asset.image_file} onDelete={() => onDelete(asset)} name={asset.name}/> 
              </Col>
            </Row>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={update}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    }
  </>
}


export default AssetModal;
