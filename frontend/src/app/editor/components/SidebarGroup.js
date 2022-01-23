import React, { useState, useContext, useEffect } from 'react';
import { Collapse } from 'react-bootstrap';
import { List, arrayMove } from 'react-movable';
import axios from "axios";
import { buildRoute } from '../../auth/client/routes';
import EditorContext from '../context';

const SidebarGroup = ({ group: { id, name }, icon, resyncProject }) => {
  const {
    project,
    selected,
    setSelected,
  } = useContext(EditorContext);
  const [editingNew, setEditingNew] = useState(false);
  const [newLayerName, setNewLayerName] = useState('');
  let layers = project.groups.find(g => g.id == id).layers.sort(x => x.order)

  const [orderedLayers, setLayers] = useState(layers)

  useEffect(() => {
    setLayers(layers)
  }, [layers])

  const open = selected.groupId === id;

  const renderLayerList = ({ children, props }) => (
    <ul {...props} className="nav flex-column sub-menu">{children}</ul>
  )

  const renderLayerItem = ({ value, props, isDragged, isSelected }) => (
    <li 
      className="nav-item py-1"
      {...props}
      onKeyDown={(e)=> e.preventDefault()}
      style={{
        ...props.style,
        listStyleType: "none",
        cursor: isDragged ? "grabbing" : "grab",
        zIndex: isDragged || isSelected ? 99 : "inherit"
      }}
    >
      <a
        className={`${selected.layerId === value.id ? 'text-light' : 'text-muted'} layer-item` }
        onClick={() => {
          setSelected({...selected, layerId: value.id})
        }}
      >
        {value.name}
        <i className="h6 mdi mdi-menu-swap layer-item-hover"></i>
      </a>
    </li>
  )

  const onLayerChange = ({ oldIndex, newIndex }) => {
    let newLayers = arrayMove(orderedLayers, oldIndex, newIndex);
    setLayers(newLayers);
    newLayers.map((l, idx) => {
      axios.put(
        buildRoute(`/editor/layers/${l.id}/`),
        {order: idx, group: id, name: l.name}
      )
    });
  }

  const createNewLayer = (name) => {
    axios.post(
      buildRoute('/editor/layers/'),
      {group: id, name: name, order: layers.length}
    ).then((response) => {
      setLayers(layers.concat(response.data));
      setSelected({...selected, layerId: response.data.id});
      setNewLayerName('');
      resyncProject();
    })
  }


  return (
    <li className={'nav-item menu-items my-1'}>
      <div
        className={open ? 'nav-link menu-expanded' : 'nav-link'}
        onClick={() => setSelected({...selected, groupId: id})}
        data-toggle="collapse"
      >
        <span className="menu-icon">
          <i className={"mdi mdi-emoticon" + icon}></i>
        </span>
        <span className="menu-title">{name}</span>
        <i className="menu-arrow"></i>
      </div>
      <Collapse in={open}>
        <div>
          <List
            values={orderedLayers}
            onChange={(e) => onLayerChange(e)}
            renderList={(rl) => renderLayerList(rl)}
            renderItem={(ri) => renderLayerItem(ri)}
          />
          { editingNew && (
            <input
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  createNewLayer(newLayerName);
                  setEditingNew(false);
                }
              }}
              value={newLayerName}
              onBlur={() => {
                setEditingNew(false);
                setNewLayerName('');
              }}
              onChange={(e) => setNewLayerName(e.target.value)}
              className="form-control"
            />
          ) }
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <span className="nav-link" onClick={() => setEditingNew(true)}>
                + Layer
              </span>
            </li>
          </ul>
        </div>
      </Collapse>
    </li>
  );
}



export default SidebarGroup;