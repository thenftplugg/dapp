import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Modal } from 'react-bootstrap'


function AuthModal({show}) {
  const [mode, setMode] = useState('login');
  return (
    <Modal show={show}>
      {mode === 'login' && <Login input={{}} errors={{}} onChange={() => setMode('register')} />}
      {mode === 'register' && <Register input={{}} errors={{}} onChange={() => setMode('login')} />}
    </Modal>
  )
}

export default AuthModal;