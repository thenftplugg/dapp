import React, { useState } from 'react';
import { login } from './utils';
import axios from 'axios';
import { buildRoute } from './client/routes';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';


export function Register({onChange}) {
  const [user, setUser] = useState({username: '', password: '', email: ''});
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!user.username) {
      newErrors.username = "Please enter a username.";
    }
    if (!isEmail(user.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (user.password?.length < 6) {
      newErrors.password = "Passwords must be 6 characters long.";
    }
    setErrors(newErrors);
    return newErrors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(validate()).length > 0) {
      return;
    }
    axios.post(buildRoute('/user'), JSON.stringify(user), {headers: {"Content-Type": "application/json"}}).then((response) => {
      if ('access_code' in response.data) {
        login(response.data.access_code);
      }
    }).catch(error => {
      const validationErrors = error?.response?.data || {};
      Object.keys(validationErrors).forEach((key) => {
        setErrors({errors, invalid: validationErrors[key][0] || "Email or username is taken."});
      });
    });
  }
  return (
    <div>
      <div className="d-flex align-items-center auth px-0 h-100">
        <div className="w-100 mx-0">
          <div>
            <div className="card text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <div class="navbar-brand h1 text-light mb-0">Cryptic Alpha</div>
              </div>
              <h4>New here?</h4>
              <h6 className="font-weight-light">Signing up is easy. It only takes a few steps</h6>
              <form className="pt-3" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="username"
                    placeholder="Username"
                    name="username"
                    value={user.username}
                    onChange={(e) => setUser({...user, username: e.target.value})}
                  />
                  <div className="text-danger">{errors.username}</div>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    placeholder="Email"
                  />
                  <div className="text-danger">{errors.email}</div>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    name="password"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value, password_confirmation: e.target.value})}
                    id="password"
                    placeholder="Password"
                  />
                  <div className="text-danger">{errors.password}</div>
                </div>
                <div className="mt-3">
                  <input type="submit" value="SIGN UP" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" />
                </div>
                <div className="my-3 text-danger">{errors.invalid}</div>
                <div className="text-center mt-4 font-weight-light">
                  Already have an account? <a href="#" onClick={onChange}>Login</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
