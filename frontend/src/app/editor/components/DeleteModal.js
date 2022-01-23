import React, { useState } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';

export const DeleteModalBody = ({image, handleClose, name, handleDelete}) => {
  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {image && (
        <div className="mb-3 text-center">
          <Image src={image} height="200"/>
        </div>
      )}
      Delete <span className="text-danger">{name}</span> ?
      You won't be able to revert this!

      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Never mind
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const DeleteModal = ({ image, onDelete, name }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleDelete = () => {
    onDelete().then(response => {
      handleClose();
    });
  }
  const handleShow = () => setShow(true);
  return (
    <>
      <i className="pointer mdi mdi-delete text-danger" onClick={handleShow}></i>
      {show &&
        <DeleteModalBody image={image} handleDelete={handleDelete} handleClose={handleClose} name={name} />
      }
    </>
  );
}

export default DeleteModal;
