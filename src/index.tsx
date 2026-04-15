import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './style.sass';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { fetchUsers } from './store/api/fetchUsers';
import { store } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

fetchUsers(store.dispatch);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
