import React, { useEffect, useState } from 'react';
import './App.scss';
import AppRoutes from './AppRoutes';
import AppContext from './contexts';
import { isLoggedIn } from './auth/utils';
import axios from 'axios';
import { buildRoute } from './auth/client/routes';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // for React, Vue and Svelte
import 'animate.css';
import Maintenance from './basic-ui/Maintenance';
import { maintenance } from './utils/maintenance';
if (!window.RareMints) {
  window.RareMints = {}
}

const configureAxios = (loggedIn) => {
  if (!!loggedIn) {
    axios.defaults.headers.common = {
      "Content-Type": "application/json",
      "Authorization": "Token " + loggedIn,
      "X-Authorization": loggedIn,
    };
  } else {
    axios.defaults.headers.common = {
      "Content-Type": "application/json",
    };
  }

  axios.interceptors.response.use(response => {
    return response;
  }, error => {
    if (error.config.method != 'get' && error.response.status === 401) {
      const notyf = new Notyf();
      notyf.error('You are not allowed to do that!');
    }
    throw error;
  });
}

function App() {
  const loggedIn = isLoggedIn();
  const [user, setUser] = useState(null);
  configureAxios(loggedIn);
  useEffect(() => {
    if (!!isLoggedIn) {
      axios.get(buildRoute('/users/me')).then((response) => {
        setUser(response.data);
      });
    }
  }, []);
  if (false) {
    return <Maintenance/>
  }
  return (
    <AppContext.Provider value={{
      loggedIn: loggedIn,
      setUser: setUser,
      user: user,
    }}>
      <AppRoutes/>
    </AppContext.Provider>
  );
}

export default App;
