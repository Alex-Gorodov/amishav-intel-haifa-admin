import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.sass';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { store } from './store';
import { fetchUsers } from './store/api/fetchUsers.api';
import { fetchSwapRequests, fetchGiveRequests } from './store/api/fetchRequests.api';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

fetchUsers(store.dispatch);
fetchSwapRequests(store.dispatch);
fetchGiveRequests(store.dispatch);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
