import React, { useState } from 'react';
import { login } from './utils';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { buildRoute } from './client/routes';

export function Login({onChange}) {
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!user.username) {
      newErrors.username = "Please enter a username.";
    }
    if (!user.password) {
      newErrors.password = "Please enter a password.";
    }
    setErrors(newErrors);
    return newErrors;
  }
  const handleSubmit = () => {
    if (Object.keys(validate()).length > 0) {
      return;
    }
    axios.post(buildRoute('/user/sign_in'), JSON.stringify(user), {headers: {"Content-Type": "application/json"}}).then((response) => {
      if ('access_code' in response.data) {
        login(response.data.access_code);
      }
    }).catch(error => {
      setErrors({errors, invalid: "Username or password is incorrect."});
    });
  }
  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="w-100 mx-0">
          <div>
            <div className="card text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <div class="navbar-brand h1 text-light mb-0">Cryptic Alpha</div>
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <Form className="pt-3">
                <Form.Group className="d-flex search-field">
                  <Form.Control onChange={(e) => setUser({...user, username: e.target.value})} placeholder="Username" size="lg" className="h-auto" />
                </Form.Group>
                <div className="text-danger">{errors.username}</div>
                <Form.Group className="d-flex search-field">
                  <Form.Control onChange={(e) => setUser({...user, password: e.target.value})} type="password" placeholder="Password" size="lg" className="h-auto" />
                </Form.Group>
                <div className="text-danger">{errors.password}</div>
                <div className="mt-3">
                  <Button onClick={handleSubmit} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/dashboard">SIGN IN</Button>
                </div>
                <div className="my-3 text-danger">{errors.invalid}</div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input"/>
                      <i className="input-helper"></i>
                      Keep me signed in
                    </label>
                  </div>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Don't have an account? <a href="#" onClick={onChange}>Create</a>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>  
    </div>
  )
}

export default Login
